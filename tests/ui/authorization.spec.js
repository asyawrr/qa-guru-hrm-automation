import { test, expect } from '../../src/helpers/fixtures/playwright.fixture.js';
import { App } from '../../src/pages/app.page.js';
import { testUser } from '../../src/config/test-user.js';
import { pageAssertions } from '../../src/helpers/assertions/index.js';

test.describe('Login', () => {
  test('Login with valid credentials and land on dashboard', async ({ page }) => {
    const app = new App(page);
    await app.loginPage.open();

    await app.loginPage.login(testUser.username, testUser.password);
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/dashboard/);
    await pageAssertions.toBeVisible(app.dashboardPage.getSidebarLocator());
  });

  test('Show error on invalid credentials', async ({ page }) => {
    const app = new App(page);
    await app.loginPage.open();

    await app.loginPage.login('invalidUsername', 'wrongPassword');
    await app.loginPage.waitForLoad();
    const error = page.getByRole('alert');

    await expect(error).toBeVisible();
    await expect(error).toContainText('Invalid credentials');
  });
});
