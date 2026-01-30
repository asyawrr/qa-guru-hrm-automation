import dotenv from 'dotenv';

// Load environment variables from the .env file
// I created a .env file with lines, where I entered valid user data without quotation marks in each line.

// TEST_USER_PASSWORD =
// TEST_USER_USERNAME =
dotenv.config();

export const testUser = {
  password: process.env.TEST_USER_PASSWORD,
  username: process.env.TEST_USER_USERNAME
};
