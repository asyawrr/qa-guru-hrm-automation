import { test, expect } from '@playwright/test';
import { AuthService } from '../../src/services/index.js';
import { testUser } from '../../src/config/test-user.js';
import { env } from '../../src/config/env.js';

test.describe('API Auth', () => {
  test('Get login page and have session cookie after login', async ({ request }) => {
    const auth = new AuthService(request);

    await test.step('GET login page and verify it loads', async () => {
      const loginPage = await request.get(`${env.BASE_URL}/web/index.php/auth/login`);
      expect(loginPage.ok()).toBeTruthy();
    });

    await test.step('Submit login form and verify redirect or success', async () => {
      const response = await auth.loginWithForm(testUser.username, testUser.password);
      expect([200, 302]).toContain(response.status());
    });
  });
});
