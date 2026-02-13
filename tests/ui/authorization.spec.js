import { test, expect } from '../../src/helpers/fixtures/playwright.fixture.js';
import { App } from '../../src/pages/app.page.js';
import { testUser } from '../../src/config/test-user.js';

test.describe('Login', () => {
  test('Login with valid credentials and land on dashboard', async ({ page }) => {
    const app = new App(page);

    await test.step('Open login page and submit valid credentials', async () => {
      await app.loginPage.open();
      await app.loginPage.login(testUser.username, testUser.password);
      await page.waitForLoadState('networkidle');
    });

    await test.step('Verify user is on dashboard with sidebar visible', async () => {
      await expect(page).toHaveURL(/dashboard/);
      await expect(app.dashboardPage.getSidebarLocator()).toBeVisible();
    });
  });

  test('Show error on invalid credentials', async ({ page }) => {
    const app = new App(page);

    await test.step('Open login page and submit invalid credentials', async () => {
      await app.loginPage.open();
      await app.loginPage.login('invalidUsername', 'wrongPassword');
      await app.loginPage.waitForLoad();
    });

    await test.step('Verify error alert shows invalid credentials message', async () => {
      await expect(app.loginPage.errorAlert).toBeVisible();
      await expect(app.loginPage.errorAlert).toContainText('Invalid credentials');
    });
  });
});
