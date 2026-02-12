import dotenv from 'dotenv';
import path from 'path';

const root = process.cwd();
dotenv.config({ path: path.join(root, '.env.test') });
dotenv.config({ path: path.join(root, '.env'), override: true });

// CI: runs in tests container, app at orangehrm:80.
const DEFAULT_URL = process.env.CI
  ? 'http://orangehrm:80'
  : 'https://opensource-demo.orangehrmlive.com';
const BASE_URL = process.env.BASE_URL || DEFAULT_URL;
const API_BASE_URL = process.env.API_BASE_URL || `${BASE_URL}/web/index.php/api/v2`;

export const env = {
  BASE_URL,
  API_BASE_URL,
};

export default env;
