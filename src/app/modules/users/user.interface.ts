// src/modules/users/user.interface.ts
import { Model, Types } from 'mongoose';
import { USER_ROLE, USER_STATUS } from './user.constant';

export type TUserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
export type TUserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export type TUser = {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: TUserRole;
  status: TUserStatus;
  isDeleted: boolean;
  passwordChangedAt?: Date;
};

export interface UserModel extends Model<TUser> {
  isUserExistByEmail(
    email: string,
  ): Promise<(TUser & { _id: Types.ObjectId }) | null>;
  isPasswordMatch(plain: string, hashed: string): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedAt: Date,
    jwtIssuedAt: number,
  ): boolean;
}
