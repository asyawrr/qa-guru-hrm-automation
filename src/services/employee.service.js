import { ApiClient } from './api-client.js';

export class EmployeeService {
  constructor(request) {
    this.client = new ApiClient(request);
  }

  async create(employee) {
    const response = await this.client.post('/pim/employees', {
      firstName: employee.firstName,
      lastName: employee.lastName,
      middleName: employee.middleName || '',
      employeeId: employee.employeeId || '',
    });
    return response;
  }

  async getById(empNumber) {
    const response = await this.client.get(`/pim/employees/${empNumber}`);
    return response;
  }

  async delete(empNumber) {
    const response = await this.client.delete(`/pim/employees`, {
      params: { ids: [empNumber] },
    });
    return response;
  }
}
