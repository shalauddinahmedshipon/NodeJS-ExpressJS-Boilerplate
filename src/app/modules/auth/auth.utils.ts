import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { CookieOptions, Response } from 'express';
import config from '../../config';
import { ACCESS_COOKIE } from './auth.constant';

type TJwtPayload = { id: string; email: string; role: string };

export const createToken = (
  payload: TJwtPayload,
  secret: string,
  expiresIn: SignOptions['expiresIn'],
) => jwt.sign(payload, secret, { expiresIn });

export const verifyToken = (token: string, secret: string) =>
  jwt.verify(token, secret) as JwtPayload & TJwtPayload;

const isProd = config.node_env === 'production';

const baseCookieOptions: CookieOptions = {
  httpOnly: true, // JS can't read it -> XSS-safe
  secure: isProd || config.cookie_same_site === 'none',
  sameSite: config.cookie_same_site,
};

// Cookie lifetime is derived from the token's own `exp`, so they never drift apart
const maxAgeOf = (token: string) => {
  const { exp } = jwt.decode(token) as JwtPayload;
  return (exp as number) * 1000 - Date.now();
};

export const setAuthCookie = (res: Response, accessToken: string) => {
  res.cookie(ACCESS_COOKIE, accessToken, {
    ...baseCookieOptions,
    maxAge: maxAgeOf(accessToken),
  });
};

export const clearAuthCookie = (res: Response) => {
  res.clearCookie(ACCESS_COOKIE, baseCookieOptions);
};
