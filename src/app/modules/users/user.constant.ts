// src/modules/users/user.constant.ts
export const USER_ROLE = {
  admin: 'admin',
  // doctor: 'doctor',    // future
  // patient: 'patient',  // future
} as const;

export const USER_STATUS = {
  active: 'active',
  deactivated: 'deactivated',
} as const;
