import { test, expect } from '../../src/helpers/fixtures/playwright.fixture.js';
import { EmployeeService } from '../../src/services/index.js';
import { EmployeeBuilder } from '../../src/helpers/builders/index.js';

test.describe('API Employees', () => {
  test('Create employee via API', async ({ authenticatedRequest }) => {
    const employeeData = new EmployeeBuilder().withFirstName('Api').withLastName('Employee').build();
    const service = new EmployeeService(authenticatedRequest);

    await test.step('POST new employee and verify response', async () => {
      const response = await service.create(employeeData);
      const body = await response.json().catch(() => ({}));

      expect(
        response.ok(),
        `API returned ${response.status()}: ${JSON.stringify(body)}`
      ).toBeTruthy();
      expect(body.data?.firstName).toBe(employeeData.firstName);
      expect(body.data?.lastName).toBe(employeeData.lastName);
      expect(body.data?.empNumber).toBeDefined();
    });
  });

  test('Get employee by id after create', async ({ authenticatedRequest }) => {
    const employeeData = new EmployeeBuilder().withFirstName('Get').withLastName('One').build();
    const service = new EmployeeService(authenticatedRequest);
    let empNumber;

    await test.step('Create employee via API and get emp number', async () => {
      const createRes = await service.create(employeeData);
      const createBody = await createRes.json();
      empNumber = createBody.data?.empNumber;
      expect(empNumber).toBeDefined();
    });

    await test.step('GET employee by id and verify data', async () => {
      const getRes = await service.getById(empNumber);
      const getBody = await getRes.json().catch(() => ({}));
      expect(
        getRes.ok(),
        `GET employee returned ${getRes.status()}: ${JSON.stringify(getBody)}`
      ).toBeTruthy();
      expect(getBody.data?.firstName).toBe(employeeData.firstName);
    });
  });
});
