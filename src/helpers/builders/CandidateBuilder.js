import { faker } from '@faker-js/faker';

export class CandidateBuilder {
  constructor() {
    this._data = {
      comment: faker.lorem.sentence(),
      consentToKeepData: false,
      contactNumber: faker.phone.number(),
      dateOfApplication: new Date().toISOString().split('T')[0],
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      vacancyId: null,
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

  withEmail(email) {
    this._data.email = email;
    return this;
  }

  withVacancyId(vacancyId) {
    this._data.vacancyId = vacancyId;
    return this;
  }

  withComment(comment) {
    this._data.comment = comment;
    return this;
  }

  build() {
    return { ...this._data };
  }
}
