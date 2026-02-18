import { test } from '@playwright/test';
import { ApiClient } from './api-client.js';

export class RecruitmentService {
  constructor(request) {
    this.client = new ApiClient(request);
  }

  async getVacancies(params = {}) {
    return test.step('API: get vacancies', async () => {
      const response = await this.client.get('/recruitment/vacancies', { params });
      return response;
    });
  }

  async createVacancy(vacancy) {
    const response = await this.client.post('/recruitment/vacancies', vacancy);
    return response;
  }

  async getCandidates(params = {}) {
    const response = await this.client.get('/recruitment/candidates', { params });
    return response;
  }

  async createCandidate(candidate) {
    return test.step('API: create candidate', async () => {
      const response = await this.client.post('/recruitment/candidates', candidate);
      return response;
    });
  }

  async getCandidate(id) {
    return test.step('API: get candidate by id', async () => {
      const response = await this.client.get(`/recruitment/candidates/${id}`);
      return response;
    });
  }
}
