// src/modules/users/user.model.ts
import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../../config';
import { TUser, UserModel } from './user.interface';
import { USER_ROLE, USER_STATUS } from './user.constant';

const userSchema = new Schema<TUser, UserModel>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: Object.values(USER_ROLE),
      default: USER_ROLE.admin,
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.active,
    },
    isDeleted: { type: Boolean, default: false },
    passwordChangedAt: { type: Date },
  },
  { timestamps: true },
);

// Hash only when the password field is new/changed
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, config.bcrypt_salt_rounds);
});

userSchema.statics.isUserExistByEmail = function (email: string) {
  return this.findOne({ email: email.toLowerCase() }).select('+password');
};

userSchema.statics.isPasswordMatch = function (plain: string, hashed: string) {
  return bcrypt.compare(plain, hashed);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedAt: Date,
  jwtIssuedAt: number,
) {
  return Math.floor(passwordChangedAt.getTime() / 1000) > jwtIssuedAt;
};

const User = model<TUser, UserModel>('User', userSchema);
export default User;
