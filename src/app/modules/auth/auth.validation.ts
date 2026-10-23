// src/modules/auth/auth.validation.ts
import { z } from 'zod';

const loginValidationSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email format'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(1, 'Password is required'),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z
    .object({
      oldPassword: z.string({ required_error: 'Old password is required' }),
      newPassword: z
        .string({ required_error: 'New password is required' })
        .min(8, 'Password must be at least 8 characters long'),
      confirmPassword: z.string({
        required_error: 'Confirm password is required',
      }),
    })
    .refine((d) => d.newPassword === d.confirmPassword, {
      message: 'New password and confirm password do not match',
      path: ['confirmPassword'],
    })
    .refine((d) => d.newPassword !== d.oldPassword, {
      message: 'New password must be different from the old password',
      path: ['newPassword'],
    }),
});

export const AuthValidation = {
  loginValidationSchema,
  changePasswordValidationSchema,
};
