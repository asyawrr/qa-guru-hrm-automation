import { expect, test } from '@playwright/test';
import { App } from '../src/pages/app.page';
import { testUser } from '../src/config/test-user';

const url = 'https://opensource-demo.orangehrmlive.com/';

// test.beforeEach(async ({ page }) => {
//   const app = new App(page);

//   await app.mainPage.open(url);
//   await app.mainPage.gotoLogin();
//   await app.loginPage.login(testUser.username, testUser.password);
// });


