import { BasePage } from '../base.page.js';

/**
 * Admin > Job > Job Titles (viewJobTitleList).
 * https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewJobTitleList
 */
export class JobTitlesPage extends BasePage {
  constructor(page) {
    super(page, '/admin/viewJobTitleList');
    this.page = page;
    this.addButton = page.getByRole('button', { name: /Add/ });
    this.jobTitleInput = page.getByRole('textbox').nth(1);
    this.jobDescriptionInput = page.getByRole('textbox', { name: 'Type description here' });
    this.jobTitleInput = page.getByRole('textbox').nth(1);
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.table = page.locator('.oxd-table');
  }

  async open() {
    await this.goto();
    return this;
  }

  async clickAdd() {
    await this.addButton.click();
    return this;
  }

  async fillJobTitle(title) {
    await this.jobTitleInput.click();
    await this.jobTitleInput.fill(title);
    return this;
  }

  async fillJobDescription(description) {
    await this.jobDescriptionInput.click();
    await this.jobDescriptionInput.fill(description);
    return this;
  }

  async save() {
    await this.saveButton.click();
    return this;
  }

  async addJobTitle(data) {
    await this.clickAdd();
    await this.jobTitleInput.waitFor({ state: 'visible'});
    await this.fillJobTitle(data.title);
    if (data.description) await this.fillJobDescription(data.description);
    await this.save();
    return this;
  }

  getTableLocator() {
    return this.table;
  }

  getJobTitleRowLocator(title) {
    return this.table.locator('.oxd-table-card').filter({ hasText: title });
  }
}
