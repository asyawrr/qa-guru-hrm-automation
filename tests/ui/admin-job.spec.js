import { test, expect } from '../../src/helpers/fixtures/playwright.fixture.js';
import { App } from '../../src/pages/app.page.js';
import { JobTitleBuilder } from '../../src/helpers/builders/index.js';

test.describe('Admin Job Titles', () => {
  test('Create job title in admin panel', async ({ authenticatedPage }) => {
    const jobTitleData = new JobTitleBuilder().build();
    const app = new App(authenticatedPage);

    await test.step('Open Admin Job Titles and add new job title', async () => {
      await app.goToAdminJobTitles();
      await app.jobTitlesPage.addJobTitle(jobTitleData);
    });

    await test.step('Verify success message and job title appears in list', async () => {
      await expect(app.jobTitlesPage.successToast).toBeVisible();
      await expect(app.jobTitlesPage.getJobTitleRowLocator(jobTitleData.title)).toBeVisible({ timeout: 10000 });
    });
  });
});
