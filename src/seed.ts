// src/seed.ts
import mongoose from 'mongoose';
import config from './app/config';
import User from './app/modules/users/user.model';
import { USER_ROLE, USER_STATUS } from './app/modules/users/user.constant';

const seedAdmin = async () => {
  const { name, email, password } = config.seed_admin;

  if (!name || !email || !password) {
    throw new Error(
      'Set SEED_ADMIN_NAME, SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env',
    );
  }

  await mongoose.connect(config.database_url);
  console.log('Database connected');

  // Idempotent: running the seed twice never creates duplicates
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log(`Admin already exists: ${email}`);
    return;
  }

  await User.create({
    name,
    email,
    password, // hashed by the pre('save') hook
    role: USER_ROLE.admin,
    status: USER_STATUS.active,
  });

  console.log(`Admin created: ${email}`);
};

seedAdmin()
  .catch((err) => {
    console.error('Seeding failed:', err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
