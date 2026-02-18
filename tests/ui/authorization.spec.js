import { test, expect } from '../../src/helpers/fixtures/playwright.fixture.js';
import { testUser } from '../../src/config/test-user.js';

test.describe('Login', () => {
  test('Login with valid credentials and land on dashboard', async ({ page, app }) => {
    await app.loginPage.open();
    await app.loginPage.login(testUser.username, testUser.password);
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/dashboard/);
    await expect(app.dashboardPage.getSidebarLocator()).toBeVisible();
  });

  test('Show error on invalid credentials', async ({ app }) => {
    await app.loginPage.open();
    await app.loginPage.login('invalidUsername', 'wrongPassword');
    await app.loginPage.waitForLoad();

    await expect(app.loginPage.errorAlert).toBeVisible();
    await expect(app.loginPage.errorAlert).toContainText('Invalid credentials');
  });
});
