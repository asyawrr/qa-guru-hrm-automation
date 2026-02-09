import dotenv from 'dotenv';
import path from 'path';

const root = process.cwd();
dotenv.config({ path: path.join(root, '.env.example') });
dotenv.config({ path: path.join(root, '.env') });

// CI or local/container: localhost. Otherwise default to demo.
const DEFAULT_URL = process.env.CI
  ? 'http://localhost:8080'
  : 'https://opensource-demo.orangehrmlive.com';
const BASE_URL = process.env.BASE_URL || DEFAULT_URL;
const API_BASE_URL = process.env.API_BASE_URL || `${BASE_URL}/web/index.php/api/v2`;

export const env = {
  BASE_URL,
  API_BASE_URL,
};

export default env;
