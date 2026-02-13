import { env } from '../config/env.js';

// Base Page Object with common navigation for all pages

export class BasePage {
  constructor(page, path = '') {
    this.page = page;
    this.basePath = path ? `${env.BASE_URL}/web/index.php${path}` : env.BASE_URL;
    this.successToast = page.locator('.oxd-toast--success');
    this.currentUser = page.locator('span.oxd-userdropdown-tab');
  }

  async goto(path = '') {
    const url = path ? `${this.basePath}${path}` : this.basePath;
    await this.page.goto(url);
    return this;
  }

  async waitForLoad() {
    await this.page.waitForLoadState('networkidle');
    return this;
  }

  async getCurrentUserName() {
    const text = await this.currentUser.textContent();
    return text?.trim();
  }
}
