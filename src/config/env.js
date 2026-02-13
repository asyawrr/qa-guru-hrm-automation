import dotenv from 'dotenv';
import path from 'path';

const root = process.cwd();
dotenv.config({ path: path.join(root, '.env.test') });
dotenv.config({ path: path.join(root, '.env'), override: true });

const BASE_URL = process.env.BASE_URL;
const API_BASE_URL = process.env.API_BASE_URL;

export const env = {
  BASE_URL,
  API_BASE_URL,
};

export default env;
