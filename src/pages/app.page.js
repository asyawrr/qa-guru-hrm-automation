import { BasePage, LoginPage, DashboardPage } from './index.js';
import { VacanciesPage } from './recruitment/index.js';
import { JobTitlesPage } from './admin/index.js';
import { EmployeeAddPage, PersonalDetailsPage } from './pim/index.js';


export class App {
  constructor(page) {
    this.page = page;
    this.loginPage = new LoginPage(page);
    this.dashboardPage = new DashboardPage(page);
    this.employeeAddPage = new EmployeeAddPage(page);
    this.personalDetailsPage = new PersonalDetailsPage(page);
    this.vacanciesPage = new VacanciesPage(page);
    this.jobTitlesPage = new JobTitlesPage(page);
    this.basePage = new BasePage(page);
  }

  async login(username, password) {
    await this.loginPage.open();
    await this.loginPage.login(username, password);
    return this;
  }

  async goToPim() {
    const dashboard = await this.dashboardPage.open();
    await dashboard.goToPim();
    return this;
  }

  async goToRecruitment() {
    const dashboard = await this.dashboardPage.open();
    await dashboard.goToRecruitment();
    return this;
  }

  async goToAdminJobTitles() {
    await this.jobTitlesPage.open();
    return this;
  }

  async getCurrentUserName() {
    return this.basePage.getCurrentUserName();
  }
}
