import { faker } from '@faker-js/faker';

export class JobTitleBuilder {
  constructor() {
    this._data = {
      description: faker.lorem.sentence(),
      title: `Job ${faker.person.jobTitle()}`,
    };
  }

  withTitle(title) {
    this._data.title = title;
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
