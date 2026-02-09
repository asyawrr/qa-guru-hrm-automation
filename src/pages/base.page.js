import { test } from '@playwright/test';
import { env } from '../config/env.js';

// Base Page Object with common behavior among all pages

export class BasePage {
  constructor(page, path = '') {
    this.page = page;
    this.basePath = path ? `${env.BASE_URL}/web/index.php${path}` : env.BASE_URL;
  }

  async goto(path = '') {
    const url = path ? `${this.basePath}${path}` : this.basePath;
    return test.step(`Open ${url}`, async () => {
      await this.page.goto(url);
      return this;
    });
  }

  async waitForLoad() {
    await this.page.waitForLoadState('networkidle');
    return this;
  }
}
