import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join((process.cwd(), '.env')),
});

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL as string,
  client_url: process.env.CLIENT_URL as string,
  bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUNDS ?? 10),
  jwt_access_secret: process.env.JWT_ACCESS_SECRET as string,
  access_token_expires_in: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
  cookie_same_site: (process.env.COOKIE_SAME_SITE ?? 'lax') as
    | 'lax'
    | 'none'
    | 'strict',
  seed_admin: {
    name: process.env.SEED_ADMIN_NAME,
    email: process.env.SEED_ADMIN_EMAIL,
    password: process.env.SEED_ADMIN_PASSWORD,
  },
};
