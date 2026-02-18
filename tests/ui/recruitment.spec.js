import { test, expect } from '../../src/helpers/fixtures/playwright.fixture.js';
import { VacancyBuilder, JobTitleBuilder } from '../../src/helpers/builders/index.js';

test.describe('Vacancies', () => {
  test('Create vacancy', async ({ authenticatedApp }) => {
    const jobTitle = new JobTitleBuilder().build();
    const hiringManagerName = await authenticatedApp.getCurrentUserName();
    const vacancy = new VacancyBuilder()
      .withJobTitle(jobTitle.title)
      .withHiringManager(hiringManagerName)
      .build();

    await authenticatedApp.goToAdminJobTitles();
    await authenticatedApp.jobTitlesPage.addJobTitle(jobTitle);
    await expect(authenticatedApp.jobTitlesPage.successToast).toBeVisible();

    await authenticatedApp.goToRecruitment();
    await authenticatedApp.vacanciesPage.open();
    await authenticatedApp.vacanciesPage.addVacancy(vacancy);

    await expect(authenticatedApp.page).toHaveURL(/\/recruitment\/addJobVacancy\/\d+/);
    await authenticatedApp.vacanciesPage.open();
    await expect(authenticatedApp.vacanciesPage.getTableLocator()).toBeVisible();
    await expect(authenticatedApp.vacanciesPage.getVacancyByNameLocator(vacancy.name)).toBeVisible();
  });

  test.describe('Edit and delete vacancy', () => {
    let jobTitle;
    let vacancy;

    test.beforeEach(async ({ authenticatedApp }) => {
      jobTitle = new JobTitleBuilder().build();
      const hiringManagerName = await authenticatedApp.getCurrentUserName();
      vacancy = new VacancyBuilder()
        .withJobTitle(jobTitle.title)
        .withHiringManager(hiringManagerName)
        .build();

      await authenticatedApp.goToAdminJobTitles();
      await authenticatedApp.jobTitlesPage.addJobTitle(jobTitle);
      await expect(authenticatedApp.jobTitlesPage.successToast).toBeVisible();
      await authenticatedApp.goToRecruitment();
      await authenticatedApp.vacanciesPage.open();
      await authenticatedApp.vacanciesPage.addVacancy(vacancy);
      await expect(authenticatedApp.page).toHaveURL(/\/recruitment\/addJobVacancy\/\d+/);
      await authenticatedApp.vacanciesPage.open();
    });

    test('Edit vacancy', async ({ authenticatedApp }) => {
      const newName = `Edited ${vacancy.name}`;

      await authenticatedApp.vacanciesPage.editVacancyName(vacancy.name, newName);
      await expect(authenticatedApp.vacanciesPage.successToast).toBeVisible();

      await authenticatedApp.vacanciesPage.open();
      await expect(authenticatedApp.vacanciesPage.getVacancyByNameLocator(newName)).toBeVisible();
    });

    test('Delete vacancy', async ({ authenticatedApp }) => {
      await authenticatedApp.vacanciesPage.deleteVacancy(vacancy.name);
      await expect(authenticatedApp.vacanciesPage.successToast).toBeVisible();

      await expect(authenticatedApp.vacanciesPage.getVacancyByNameLocator(vacancy.name)).toHaveCount(0);
    });

    test('Bulk delete vacancies', async ({ authenticatedApp }) => {
      const secondVacancy = new VacancyBuilder()
        .withJobTitle(jobTitle.title)
        .withHiringManager(vacancy.hiringManager)
        .build();

      await authenticatedApp.vacanciesPage.addVacancy(secondVacancy);
      await expect(authenticatedApp.page).toHaveURL(/\/recruitment\/addJobVacancy\/\d+/);

      await authenticatedApp.vacanciesPage.open();
      await authenticatedApp.vacanciesPage.filterByJobTitle(jobTitle.title);
      await expect(authenticatedApp.vacanciesPage.getVacancyByNameLocator(vacancy.name)).toBeVisible({ timeout: 15000 });
      await expect(authenticatedApp.vacanciesPage.getVacancyByNameLocator(secondVacancy.name)).toBeVisible();

      await authenticatedApp.vacanciesPage.bulkDeleteFilteredVacancies();
      await expect(authenticatedApp.vacanciesPage.successToast).toBeVisible();

      await expect(authenticatedApp.vacanciesPage.getVacancyByNameLocator(vacancy.name)).toHaveCount(0);
      await expect(authenticatedApp.vacanciesPage.getVacancyByNameLocator(secondVacancy.name)).toHaveCount(0);
    });
  });
});
