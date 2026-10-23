// src/modules/auth/auth.route.ts
import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../users/user.constant';
import { AuthValidation } from './auth.validation';
import { authControllers } from './auth.controller';

const router = express.Router();

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  authControllers.loginUser,
);
router.post('/logout', authControllers.logoutUser);
router.get('/me', auth(USER_ROLE.admin), authControllers.getMe);
router.post(
  '/change-password',
  auth(USER_ROLE.admin),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  authControllers.changePassword,
);

export const authRoutes = router;
