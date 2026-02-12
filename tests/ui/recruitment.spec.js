import { test, expect } from '../../src/helpers/fixtures/playwright.fixture.js';
import { App } from '../../src/pages/app.page.js';
import { VacancyBuilder, JobTitleBuilder } from '../../src/helpers/builders/index.js';

test.describe('Vacancies', () => {
  let app;

  test.beforeEach(async ({ authenticatedPage }) => {
    app = new App(authenticatedPage);
  });

  test('Create vacancy', async ({ authenticatedPage }) => {
    const jobTitle = new JobTitleBuilder().build();
    const hiringManagerName = await app.getCurrentUserName();
    const vacancy = new VacancyBuilder()
      .withJobTitle(jobTitle.title)
      .withHiringManager(hiringManagerName)
      .build();

    await test.step('Create job title in Admin and verify success', async () => {
      await app.goToAdminJobTitles();
      await app.jobTitlesPage.addJobTitle(jobTitle);
      await expect(app.jobTitlesPage.successToast).toBeVisible();
    });

    await test.step('Open Recruitment and add new vacancy', async () => {
      await app.goToRecruitment();
      await app.vacanciesPage.open();
      await app.vacanciesPage.addVacancy(vacancy);
    });

    await test.step('Verify vacancy is created and visible in list', async () => {
      await expect(authenticatedPage).toHaveURL(/\/recruitment\/addJobVacancy\/\d+/);
      await app.vacanciesPage.open();
      await expect(app.vacanciesPage.getTableLocator()).toBeVisible();
      await expect(app.vacanciesPage.getVacancyByNameLocator(vacancy.name)).toBeVisible();
    });
  });

  test.describe('Edit and delete vacancy', () => {
    let jobTitle;
    let vacancy;

    test.beforeEach(async ({ authenticatedPage }) => {
      jobTitle = new JobTitleBuilder().build();
      const hiringManagerName = await app.getCurrentUserName();
      vacancy = new VacancyBuilder()
        .withJobTitle(jobTitle.title)
        .withHiringManager(hiringManagerName)
        .build();

      await test.step('Create job title and vacancy for edit/delete tests', async () => {
        await app.goToAdminJobTitles();
        await app.jobTitlesPage.addJobTitle(jobTitle);
        await expect(app.jobTitlesPage.successToast).toBeVisible();
        await app.goToRecruitment();
        await app.vacanciesPage.open();
        await app.vacanciesPage.addVacancy(vacancy);
        await expect(authenticatedPage).toHaveURL(/\/recruitment\/addJobVacancy\/\d+/);
        await app.vacanciesPage.open();
      });
    });

    test('Edit vacancy', async ({ authenticatedPage }) => {
      const newName = `Edited ${vacancy.name}`;

      await test.step('Open vacancy for edit and change name', async () => {
        await app.vacanciesPage.clickEditForVacancy(vacancy.name);
        await authenticatedPage.waitForURL(/\/recruitment\/addJobVacancy\/\d+/, { timeout: 10000 });
        await expect(app.vacanciesPage.vacancyNameInput).toHaveValue(vacancy.name, { timeout: 10000 });
        await app.vacanciesPage.vacancyNameInput.fill(newName);
        await app.vacanciesPage.saveButton.click();
        await expect(app.vacanciesPage.successToast).toBeVisible();
      });

      await test.step('Verify vacancy shows updated name in list', async () => {
        await app.vacanciesPage.open();
        await expect(app.vacanciesPage.getVacancyByNameLocator(newName)).toBeVisible();
      });
    });

    test('Delete vacancy', async ({ authenticatedPage }) => {
      const app = new App(authenticatedPage);

      await test.step('Delete vacancy and confirm', async () => {
        await app.vacanciesPage.clickDeleteForVacancy(vacancy.name);
        await app.vacanciesPage.confirmDelete();
        await expect(app.vacanciesPage.successToast).toBeVisible();
      });

      await test.step('Verify vacancy is removed from list', async () => {
        await expect(app.vacanciesPage.getVacancyByNameLocator(vacancy.name)).toHaveCount(0);
      });
    });

    test('Bulk delete vacancies', async ({ authenticatedPage }) => {
      const secondVacancy = new VacancyBuilder()
        .withJobTitle(jobTitle.title)
        .withHiringManager(vacancy.hiringManager)
        .build();

      await test.step('Create second vacancy for bulk delete', async () => {
        await app.vacanciesPage.addVacancy(secondVacancy);
        await expect(authenticatedPage).toHaveURL(/\/recruitment\/addJobVacancy\/\d+/);
      });

      // added this step because tests run through 3 browsers in parallel. 
      // Without filtering only one browser passed (Chromium, because it works faster) and others failed because vacancies list was empty.
      await test.step('Open vacancies list and filter by job title', async () => {
        await app.vacanciesPage.open();
        await app.vacanciesPage.filterByJobTitle(jobTitle.title);
        await expect(app.vacanciesPage.getVacancyByNameLocator(vacancy.name)).toBeVisible({ timeout: 15000 });
        await expect(app.vacanciesPage.getVacancyByNameLocator(secondVacancy.name)).toBeVisible();
      });

      await test.step('Select all vacancies and confirm bulk delete', async () => {
        await app.vacanciesPage.selectAllVacancies();
        await app.vacanciesPage.clickDeleteSelected();
        await expect(app.vacanciesPage.bulkDeleteModal).toBeVisible();
        await expect(app.vacanciesPage.bulkDeleteCancelButton).toBeVisible();
        await expect(app.vacanciesPage.deleteConfirmButton).toBeVisible();
        await app.vacanciesPage.confirmBulkDelete();
        await expect(app.vacanciesPage.successToast).toBeVisible();
      });

      await test.step('Verify both vacancies are removed from list', async () => {
        await expect(app.vacanciesPage.getVacancyByNameLocator(vacancy.name)).toHaveCount(0);
        await expect(app.vacanciesPage.getVacancyByNameLocator(secondVacancy.name)).toHaveCount(0);
        await expect(app.vacanciesPage.successToast).toBeVisible();
      });
    });
  });
});