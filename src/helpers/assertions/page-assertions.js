import { expect } from '@playwright/test';
/*
  Custom assertions that work with page elements (locators).
*/
export const pageAssertions = {
  async toBeVisible(locator) {
    await expect(locator).toBeVisible();
  },

  async toHaveText(locator, text) {
    await expect(locator).toHaveText(text);
  },

  async toContainText(locator, text) {
    await expect(locator).toContainText(text);
  },

  async toHaveValue(locator, value) {
    await expect(locator).toHaveValue(value);
  },

  async toHaveCount(locator, count) {
    await expect(locator).toHaveCount(count);
  },

  async toastSuccess(page) {
    const toast = page.locator('.oxd-toast--success');
    await expect(toast).toBeVisible();
  },

  async toastContainsMessage(page, message) {
    const toast = page.locator('.oxd-toast');
    await expect(toast).toContainText(message);
  },

  async urlContains(page, fragment) {
    await expect(page).toHaveURL(new RegExp(fragment));
  },
};

export default pageAssertions;
