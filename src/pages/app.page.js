import { LoginPage } from './index';

export class App {
  constructor(page) {
    this.page = page;

    this.loginPage = new LoginPage(page);
  }
}
