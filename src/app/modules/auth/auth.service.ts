import { StatusCodes } from 'http-status-codes';
import { JwtPayload, SignOptions } from 'jsonwebtoken';
import AppError from '../../error/AppError';
import config from '../../config';
import User from '../users/user.model';
import { USER_STATUS } from '../users/user.constant';
import { LOGIN_ALLOWED_ROLES } from './auth.constant';
import { TChangePassword, TLogin } from './auth.interface';
import { createToken } from './auth.utils';

const loginUser = async (payload: TLogin) => {
  const user = await User.isUserExistByEmail(payload.email);

  // Same error for "no user" and "wrong password" -> no account enumeration
  const invalid = new AppError(
    StatusCodes.UNAUTHORIZED,
    'Invalid email or password',
  );
  if (!user || user.isDeleted) throw invalid;
  if (!(await User.isPasswordMatch(payload.password, user.password)))
    throw invalid;

  if (user.status !== USER_STATUS.active) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Your account is deactivated');
  }
  if (!LOGIN_ALLOWED_ROLES.includes(user.role)) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'You are not allowed to access this portal',
    );
  }

  const accessToken = createToken(
    { id: String(user._id), email: user.email, role: user.role },
    config.jwt_access_secret,
    config.access_token_expires_in as SignOptions['expiresIn'],
  );

  return {
    accessToken,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  };
};

const getMe = async (userData: JwtPayload) => {
  const user = await User.findById(userData.id).select(
    'name email role status createdAt',
  );
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  return user;
};

const changePassword = async (
  userData: JwtPayload,
  payload: TChangePassword,
) => {
  const user = await User.findById(userData.id).select('+password');
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, 'User not found');

  if (!(await User.isPasswordMatch(payload.oldPassword, user.password))) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Old password is incorrect');
  }

  user.password = payload.newPassword; // hashed by pre('save')
  user.passwordChangedAt = new Date(); // invalidates all older tokens
  await user.save();

  return null;
};

export const authServices = {
  loginUser,
  getMe,
  changePassword,
};
