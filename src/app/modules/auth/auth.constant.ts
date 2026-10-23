// src/modules/auth/auth.constant.ts
import { USER_ROLE } from '../users/user.constant';
import { TUserRole } from '../users/user.interface';

// Only these roles may log in. Add doctor/patient here when their dashboards exist.
export const LOGIN_ALLOWED_ROLES: TUserRole[] = [USER_ROLE.admin];

export const ACCESS_COOKIE = 'accessToken';
