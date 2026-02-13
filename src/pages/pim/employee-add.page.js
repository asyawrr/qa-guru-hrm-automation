import { BasePage } from '../base.page.js';

export class EmployeeAddPage extends BasePage {
  constructor(page) {
    super(page, '/pim/addEmployee');
    this.employeeIdInput = page.locator('.oxd-input').nth(4);
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
    this.middleNameInput = page.getByRole('textbox', { name: 'Middle Name' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.toast = page.locator('.oxd-toast');
  }

  async open() {
    await this.goto();
    return this;
  }

  async fillFirstName(firstName) {
    await this.firstNameInput.click();
    await this.firstNameInput.fill(firstName);
    return this;
  }

  async fillLastName(lastName) {
    await this.lastNameInput.click();
    await this.lastNameInput.fill(lastName);
    return this;
  }

  async fillMiddleName(middleName) {
    await this.middleNameInput.click();
    await this.middleNameInput.fill(middleName);
    return this;
  }

  async fillEmployeeId(id) {
    await this.employeeIdInput.click();
    await this.employeeIdInput.fill(id);
    return this;
  }

  async save() {
    await this.saveButton.click();
    return this;
  }

  async addEmployee(employee) {
    await this.fillFirstName(employee.firstName);
    await this.fillLastName(employee.lastName);
    if (employee.middleName) await this.fillMiddleName(employee.middleName);
    if (employee.employeeId) await this.fillEmployeeId(employee.employeeId);
    await this.save();
    return this;
  }
}
