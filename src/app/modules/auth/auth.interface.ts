// src/modules/auth/auth.interface.ts
export type TLogin = {
  email: string;
  password: string;
};

export type TChangePassword = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};
