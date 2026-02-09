import { BasePage } from './base.page.js';

export class DashboardPage extends BasePage {
  constructor(page) {
    super(page, '/dashboard/index');
    this.userDropdown = page.getByRole('button', { name: /dropdown/i }).first();
    this.sidebar = page.locator('.oxd-sidepanel');
    this.menuPim = page.getByRole('link', { name: 'PIM' });
    this.menuRecruitment = page.getByRole('link', { name: 'Recruitment' });
  }

  async open() {
    await this.goto();
    return this;
  }

  async goToPim() {
    await this.menuPim.click();
    return this;
  }

  async goToRecruitment() {
    await this.menuRecruitment.click();
    return this;
  }

  getSidebarLocator() {
    return this.sidebar;
  }
}
