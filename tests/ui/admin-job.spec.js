import { test, expect } from '../../src/helpers/fixtures/playwright.fixture.js';
import { JobTitleBuilder } from '../../src/helpers/builders/index.js';

test.describe('Admin Job Titles', () => {
  test('Create job title in admin panel', async ({ authenticatedApp }) => {
    const jobTitleData = new JobTitleBuilder().build();

    await authenticatedApp.goToAdminJobTitles();
    await authenticatedApp.jobTitlesPage.addJobTitle(jobTitleData);

    await expect(authenticatedApp.jobTitlesPage.successToast).toBeVisible();
  });
});
