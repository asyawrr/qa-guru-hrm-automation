import { test as base, expect } from '@playwright/test';
import { App } from '../../pages/app.page.js';
import { AuthService } from '../../services/index.js';
import { testUser } from '../../config/test-user.js';
import { env } from '../../config/env.js';

// Custom fixtures: authenticated page, authenticated request

export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    const app = new App(page);
    await app.loginPage.open();
    await app.loginPage.login(testUser.username, testUser.password);
    await page.waitForURL(/dashboard/);
    await use(page);
  },

  authenticatedRequest: async ({ request }, use) => {
    const auth = new AuthService(request);
    const loginRes = await auth.loginWithForm(testUser.username, testUser.password);

    if (loginRes.url().includes('/auth/login')) {
      throw new Error(
        `Login failed (remained on the login page). Check TEST_USER_USERNAME and TEST_USER_PASSWORD in .env for ${env.BASE_URL}`
      );
    }

    await use(request);
  },
});

export { expect };
