import { faker } from '@faker-js/faker';

// Builder for Vacancy. vacancyName, jobTitle, hiringManagerId are required.

export class VacancyBuilder {
  constructor() {
    this._data = {
      description: faker.lorem.paragraph(),
      hiringManager: null,
      jobTitle: null,
      name: `Vacancy ${faker.person.jobTitle()}`,
      numberOfPositions: String(faker.number.int({ min: 1, max: 5 })),
    };
  }

  withName(name) {
    this._data.name = name;
    return this;
  }

  withJobTitle(jobTitle) {
    this._data.jobTitle = jobTitle;
    return this;
  }

  withHiringManager(managerName) {
    this._data.hiringManager = managerName;
    return this;
  }

  withNumberOfPositions(num) {
    this._data.numberOfPositions = String(num);
    return this;
  }

  withDescription(description) {
    this._data.description = description;
    return this;
  }

  build() {
    return { ...this._data };
  }
}
