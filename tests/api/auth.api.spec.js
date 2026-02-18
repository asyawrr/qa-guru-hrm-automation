import { test, expect } from '../../src/helpers/fixtures/playwright.fixture.js';
import { testUser } from '../../src/config/test-user.js';
import { env } from '../../src/config/env.js';

test.describe('API Auth', () => {
  test('Get login page and have session cookie after login', async ({ request, authService }) => {
    const loginPage = await request.get(`${env.BASE_URL}/web/index.php/auth/login`);
    expect(loginPage.ok()).toBeTruthy();

    const response = await authService.loginWithForm(testUser.username, testUser.password);
    expect([200, 302]).toContain(response.status());
  });
});
