import { BasePage } from './base.page.js';

export class LoginPage extends BasePage {
  constructor(page) {
    super(page, '/auth/login');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
  }

  async open() {
    await this.goto();
    return this;
  }

  async fillUsername(username) {
    await this.usernameInput.click();
    await this.usernameInput.fill(username);
    return this;
  }

  async fillPassword(password) {
    await this.passwordInput.click();
    await this.passwordInput.fill(password);
    return this;
  }

  async submit() {
    await this.loginButton.click();
    return this;
  }


  async login(username, password) {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.submit();
    return this;
  }
}
