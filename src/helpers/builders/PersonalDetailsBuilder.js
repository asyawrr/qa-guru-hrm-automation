import { faker } from '@faker-js/faker';

export class PersonalDetailsBuilder {
  constructor() {
    this._data = {
      bloodType: null,
      dateOfBirth: faker.date.past({ years: 30 }).toISOString().split('T')[0],
      gender: 'Male',
      licenseExpiryDate: faker.date.future().toISOString().split('T')[0],
      licenseNumber: faker.string.alphanumeric(8),
      maritalStatus: null,
      middleName: faker.person.middleName() || '',
      militaryService: '',
      nationality: null,
      nickname: faker.person.firstName(),
      otherId: faker.string.alphanumeric(6),
      sinNumber: '',
      smoker: false,
    };
  }

  withMiddleName(middleName) {
    this._data.middleName = middleName;
    return this;
  }

  withNickname(nickname) {
    this._data.nickname = nickname;
    return this;
  }

  withDateOfBirth(date) {
    this._data.dateOfBirth = date;
    return this;
  }

  withNationality(nationality) {
    this._data.nationality = nationality;
    return this;
  }

  withMaritalStatus(maritalStatus) {
    this._data.maritalStatus = maritalStatus;
    return this;
  }

  build() {
    return { ...this._data };
  }
}
