import { BasePage } from '../base.page.js';

export class VacanciesPage extends BasePage {
  constructor(page) {
    super(page, '/recruitment/viewJobVacancy');
    
    this.addButton = page.getByRole('button', { name: 'Add' });
    this.bulkDeleteCancelButton = page.getByRole('button', { name: 'No, Cancel' });
    this.bulkDeleteModal = page.getByText(/Are you Sure\?/);
    this.deleteConfirmButton = page.getByRole('button', { name: 'Yes, Delete' });
    this.deleteSelectedButton = page.getByRole('button', { name: /Delete Selected/ });
    this.descriptionInput = page.locator('textarea');
    this.filterJobTitleDropdown = page.locator('.oxd-table-filter form .oxd-grid-item').first().locator('.oxd-select-text');
    this.hiringManagerInput = page.getByRole('textbox', { name: 'Type for hints...' });
    this.jobTitleDropdown = page.locator('form i').first();
    this.numberOfPositionsInput = page.getByRole('textbox').nth(4);
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.selectAllCheckbox = page.locator('.oxd-table-header .oxd-checkbox-input');
    this.table = page.locator('.oxd-table');
    this.vacancyNameInput = page.locator('.orangehrm-card-container form .oxd-grid-item').first().getByRole('textbox');
  }

  async filterByJobTitle(jobTitleText) {
    await this.filterJobTitleDropdown.click();
    await this.page.getByRole('option', { name: new RegExp(jobTitleText, 'i') }).click();
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
    return this;
  }

  async selectAllVacancies() {
    await this.selectAllCheckbox.waitFor({ state: 'visible', timeout: 10000 });
    await this.selectAllCheckbox.scrollIntoViewIfNeeded();
    await this.selectAllCheckbox.click({ force: true });
    return this;
  }

  async clickDeleteSelected() {
    await this.deleteSelectedButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.deleteSelectedButton.click();
    return this;
  }

  async confirmBulkDelete() {
    await this.deleteConfirmButton.click();
    return this;
  }

  getVacancyRowLocator(vacancyName) {
    return this.table.locator('.oxd-table-card').filter({ hasText: vacancyName });
  }

  async clickEditForVacancy(vacancyName) {
    await this.getVacancyRowLocator(vacancyName).getByRole('button').nth(1).click();
    return this;
  }

  async clickDeleteForVacancy(vacancyName) {
    await this.getVacancyRowLocator(vacancyName).getByRole('button').first().click();
    return this;
  }

  async confirmDelete() {
    await this.deleteConfirmButton.click();
    return this;
  }

  async open() {
    await this.goto();
    return this;
  }

  async addVacancy(vacancy) {
    await this.addButton.click();
    await this.page.waitForURL(/\/recruitment\/addJobVacancy/, { timeout: 15000 });
    await this.vacancyNameInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.vacancyNameInput.fill(vacancy.name);
    if (vacancy.jobTitle) await this.selectJobTitle(vacancy.jobTitle);
    if (vacancy.hiringManager) await this.selectHiringManager(vacancy.hiringManager);
    if (vacancy.numberOfPositions != null) {
      await this.numberOfPositionsInput.fill(String(vacancy.numberOfPositions));
    }
    if (vacancy.description) await this.descriptionInput.fill(vacancy.description);
    await this.saveButton.click();
    return this;
  }

  async selectJobTitle(jobTitleText) {
    await this.jobTitleDropdown.click();
    await this.page.getByRole('option', { name: new RegExp(jobTitleText, 'i') }).click();
    return this;
  }

  async selectHiringManager(managerName) {
    await this.hiringManagerInput.click();
    await this.hiringManagerInput.fill(managerName);
    const option = this.page.getByRole('option', { name: managerName });
    await option.waitFor({ state: 'visible', timeout: 10000 });
    await option.click();
    return this;
  }

  getTableLocator() {
    return this.table;
  }

  getVacancyByNameLocator(name) {
    return this.table.getByText(name);
  }
}
