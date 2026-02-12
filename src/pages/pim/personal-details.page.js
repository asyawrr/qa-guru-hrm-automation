import { BasePage } from '../base.page.js';

export class PersonalDetailsPage extends BasePage {
  constructor(page) {
    super(page, '/pim');
    this.page = page;
    this.dobInput = page.getByPlaceholder('yyyy-mm-dd').first();
    this.editSaveButton = page.getByRole('button', { name: 'Save' }).first();
    this.genderFemale = page.getByRole('radio', { name: 'Female' });
    this.genderMale = page.getByRole('radio', { name: 'Male' });
    this.maritalDropdown = page.locator('.oxd-select-text').nth(1);
    this.middleNameInput = page.getByRole('textbox', { name: 'Middle Name' }).first();
    this.nationalityDropdown = page.locator('.oxd-select-text').first();
    this.nicknameInput = page.getByRole('textbox', { name: 'Nickname' }).first();
    this.otherIdInput = page.locator('input').filter({ has: page.locator('[name="otherId"]') }).first();
    this.toast = page.locator('.oxd-toast');
  }

  async open(employeeId) {
    await this.goto(`/viewPersonalDetails/empNumber/${employeeId}`);
    return this;
  }

  async clickEdit() {
    const editBtn = this.page.getByRole('button', { name: 'Edit' }).first();
    await editBtn.click();
    return this;
  }

  async fillMiddleName(value) {
    await this.middleNameInput.fill(value);
    return this;
  }

  async fillNickname(value) {
    await this.nicknameInput.fill(value);
    return this;
  }

  async fillDateOfBirth(date) {
    await this.dobInput.fill(date);
    return this;
  }

  async selectNationality(optionText) {
    await this.nationalityDropdown.click();
    await this.page.getByRole('option', { name: optionText }).click();
    return this;
  }

  async selectMaritalStatus(optionText) {
    await this.maritalDropdown.click();
    await this.page.getByRole('option', { name: optionText }).click();
    return this;
  }

  async save() {
    await this.editSaveButton.click();
    return this;
  }

  async updatePersonalDetails(details) {
    await this.clickEdit();
    if (details.middleName != null) await this.fillMiddleName(details.middleName);
    if (details.nickname != null) await this.fillNickname(details.nickname);
    if (details.dateOfBirth != null) await this.fillDateOfBirth(details.dateOfBirth);
    if (details.nationality != null) await this.selectNationality(details.nationality);
    if (details.maritalStatus != null) await this.selectMaritalStatus(details.maritalStatus);
    await this.save();
    return this;
  }
}
