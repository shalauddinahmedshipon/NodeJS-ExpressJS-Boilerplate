import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { authServices } from './auth.service';
import { clearAuthCookie, setAuthCookie } from './auth.utils';

const loginUser = catchAsync(async (req, res) => {
  const { accessToken, user } = await authServices.loginUser(req.body);
  setAuthCookie(res, accessToken);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Login successful',
    data: { user }, // token is NOT in the body
  });
});

const logoutUser = catchAsync(async (_req, res) => {
  clearAuthCookie(res);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Logout successful',
    data: null,
  });
});

const getMe = catchAsync(async (req, res) => {
  const result = await authServices.getMe(req.user);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Profile retrieved successfully',
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  await authServices.changePassword(req.user, req.body);
  clearAuthCookie(res); // force re-login with the new password
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Password changed successfully, please login again',
    data: null,
  });
});

export const authControllers = {
  loginUser,
  logoutUser,
  getMe,
  changePassword,
};
