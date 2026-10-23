// src/middlewares/auth.ts
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import AppError from '../error/AppError';
import catchAsync from '../utils/catchAsync';
import config from '../config';
import User from '../modules/users/user.model';
import { TUserRole } from '../modules/users/user.interface';
import { USER_STATUS } from '../modules/users/user.constant';
import { ACCESS_COOKIE } from '../modules/auth/auth.constant';
import { verifyToken } from '../modules/auth/auth.utils';

const getToken = (req: Request) => {
  if (req.cookies?.[ACCESS_COOKIE]) return req.cookies[ACCESS_COOKIE] as string;
  const header = req.headers.authorization; // fallback for Postman / tools
  return header?.startsWith('Bearer ') ? header.slice(7) : undefined;
};

const auth = (...requiredRoles: TUserRole[]) =>
  catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
    const token = getToken(req);
    if (!token)
      throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized');

    let decoded;
    try {
      decoded = verifyToken(token, config.jwt_access_secret);
    } catch {
      // Frontend treats any 401 as "session over" and redirects to /login
      throw new AppError(
        StatusCodes.UNAUTHORIZED,
        'Session expired or invalid',
      );
    }

    const user = await User.findById(decoded.id);
    if (!user || user.isDeleted || user.status !== USER_STATUS.active) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized');
    }

    if (
      user.passwordChangedAt &&
      User.isJWTIssuedBeforePasswordChanged(
        user.passwordChangedAt,
        decoded.iat as number,
      )
    ) {
      throw new AppError(
        StatusCodes.UNAUTHORIZED,
        'Password changed, please login again',
      );
    }

    // Authorization: role comes from the DB, not only the token
    if (requiredRoles.length && !requiredRoles.includes(user.role)) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        'You do not have permission to perform this action',
      );
    }

    req.user = decoded;
    next();
  });

export default auth;
