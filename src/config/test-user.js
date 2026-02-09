import { env } from './env.js';

const isLocalEnv = () => {
  if (process.env.CI) return true;
  try {
    const host = new URL(env.BASE_URL).hostname;
    return host === 'localhost' || host === '127.0.0.1' || host === 'orangehrm';
  } catch {
    return false;
  }
};

const useLocalCredentials = isLocalEnv();
export const testUser = {
  username: useLocalCredentials ? process.env.TEST_USER_USERNAME : 'Admin',
  password: useLocalCredentials ? process.env.TEST_USER_PASSWORD : 'admin123',
  hiringManagerName: process.env.HIRING_MANAGER_NAME ?? 'Admin',
  hiringManagerId: process.env.HIRING_MANAGER_ID ?? 1,
};
