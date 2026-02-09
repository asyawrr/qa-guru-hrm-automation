import { LoginPage, DashboardPage } from './index.js';
import { VacanciesPage, CandidatesPage } from './recruitment/index.js';
import { JobTitlesPage } from './admin/index.js';
import {
  EmployeeListPage,
  EmployeeAddPage,
  PersonalDetailsPage,
  ImmigrationPage,
} from './pim/index.js';


export class App {
  constructor(page) {
    this.page = page;
    this.loginPage = new LoginPage(page);
    this.dashboardPage = new DashboardPage(page);
    this.employeeListPage = new EmployeeListPage(page);
    this.employeeAddPage = new EmployeeAddPage(page);
    this.personalDetailsPage = new PersonalDetailsPage(page);
    this.immigrationPage = new ImmigrationPage(page);
    this.vacanciesPage = new VacanciesPage(page);
    this.candidatesPage = new CandidatesPage(page);
    this.jobTitlesPage = new JobTitlesPage(page);
  }

  async login(username, password) {
    await this.loginPage.open().login(username, password);
    return this;
  }

  async goToPim() {
    await this.dashboardPage.open().goToPim();
    return this;
  }

  async goToRecruitment() {
    await this.dashboardPage.open().goToRecruitment();
    return this;
  }

  async goToAdminJobTitles() {
    await this.jobTitlesPage.open();
    return this;
  }
}
