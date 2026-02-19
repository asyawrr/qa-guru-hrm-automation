import { test as base, expect } from '@playwright/test';
import { App } from '../../pages/app.page.js';
import { AuthService, EmployeeService, RecruitmentService } from '../../services/index.js';
import { testUser } from '../../config/test-user.js';
import { env } from '../../config/env.js';

// Custom fixtures: app facade, authenticated page/app, API services

export const test = base.extend({
  app: async ({ page }, use) => {
    await use(new App(page));
  },

  authenticatedPage: async ({ page }, use) => {
    const app = new App(page);
    await app.loginPage.open();
    await app.loginPage.login(testUser.username, testUser.password);
    await page.waitForURL(/dashboard/);
    await use(page);
  },

  authenticatedApp: async ({ authenticatedPage }, use) => {
    await use(new App(authenticatedPage));
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

  authService: async ({ request }, use) => {
    await use(new AuthService(request));
  },

  employeeService: async ({ authenticatedRequest }, use) => {
    await use(new EmployeeService(authenticatedRequest));
  },

  recruitmentService: async ({ authenticatedRequest }, use) => {
    await use(new RecruitmentService(authenticatedRequest));
  }
});

export { expect };
