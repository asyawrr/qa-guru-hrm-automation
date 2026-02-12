import { faker } from '@faker-js/faker';

export class EmployeeBuilder {
  constructor() {
    this._data = {
      employeeId: null,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      middleName: '',
    };
  }

  withFirstName(firstName) {
    this._data.firstName = firstName;
    return this;
  }

  withLastName(lastName) {
    this._data.lastName = lastName;
    return this;
  }

  withMiddleName(middleName) {
    this._data.middleName = middleName;
    return this;
  }

  withEmployeeId(employeeId) {
    this._data.employeeId = employeeId;
    return this;
  }

  build() {
    return { ...this._data };
  }
}
