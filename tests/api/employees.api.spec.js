import { test, expect } from '../../src/helpers/fixtures/playwright.fixture.js';
import { EmployeeBuilder } from '../../src/helpers/builders/index.js';

test.describe('API Employees', () => {
  test('Create employee via API', async ({ employeeService }) => {
    const employeeData = new EmployeeBuilder()
      .withFirstName('Api')
      .withLastName('Employee')
      .build();

    const response = await employeeService.create(employeeData);
    const body = await response.json().catch(() => ({}));

    expect(
      response.ok(),
      `API returned ${response.status()}: ${JSON.stringify(body)}`
    ).toBeTruthy();
    expect(body.data?.firstName).toBe(employeeData.firstName);
    expect(body.data?.lastName).toBe(employeeData.lastName);
    expect(body.data?.empNumber).toBeDefined();
  });

  test('Get employee by id after create', async ({ employeeService }) => {
    const employeeData = new EmployeeBuilder().withFirstName('Get').withLastName('One').build();
    let empNumber;

    const createRes = await employeeService.create(employeeData);
    const createBody = await createRes.json();
    empNumber = createBody.data?.empNumber;
    expect(empNumber).toBeDefined();

    const getRes = await employeeService.getById(empNumber);
    const getBody = await getRes.json().catch(() => ({}));
    expect(
      getRes.ok(),
      `GET employee returned ${getRes.status()}: ${JSON.stringify(getBody)}`
    ).toBeTruthy();
    expect(getBody.data?.firstName).toBe(employeeData.firstName);
  });
});
