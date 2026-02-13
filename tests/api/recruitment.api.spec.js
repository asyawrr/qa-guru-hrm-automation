import { test, expect } from '../../src/helpers/fixtures/playwright.fixture.js';
import { RecruitmentService } from '../../src/services/index.js';
import { CandidateBuilder } from '../../src/helpers/builders/index.js';

test.describe('API Recruitment', () => {
  test('Get vacancies list via API', async ({ authenticatedRequest }) => {
    const service = new RecruitmentService(authenticatedRequest);

    await test.step('GET vacancies and parse response', async () => {
      const response = await service.getVacancies();
      const body = await response.json().catch(() => ({}));
      expect(response.ok()).toBeTruthy();
      expect(Array.isArray(body.data ?? body)).toBeTruthy();
    });
  });

  test('Create candidate via API', async ({ authenticatedRequest }) => {
    const candidateData = new CandidateBuilder()
      .withFirstName('Api')
      .withLastName('Candidate')
      .withEmail(`api.cand.${Date.now()}@test.com`)
      .build();
    const service = new RecruitmentService(authenticatedRequest);

    await test.step('Get vacancy id and POST new candidate', async () => {
      const vacRes = await service.getVacancies();
      const vacBody = await vacRes.json().catch(() => ({}));
      const vacancies = vacBody.data ?? vacBody ?? [];
      const firstVacancyId = vacancies[0]?.id ?? null;
      const payload = {
        firstName: candidateData.firstName,
        lastName: candidateData.lastName,
        email: candidateData.email,
      };
      if (firstVacancyId != null) payload.vacancyId = firstVacancyId;

      const response = await service.createCandidate(payload);
      const body = await response.json().catch(() => ({}));

      expect(response.ok(), body?.message ?? JSON.stringify(body)).toBeTruthy();
      expect(body.data?.firstName ?? body.firstName).toBe(candidateData.firstName);
    });
  });

  test('Get candidate by id after create', async ({ authenticatedRequest }) => {
    const candidateData = new CandidateBuilder()
      .withFirstName('GetCand')
      .withLastName('Id')
      .withEmail(`getcand.${Date.now()}@test.com`)
      .build();
    const service = new RecruitmentService(authenticatedRequest);
    let id;

    await test.step('Create candidate via API and get id', async () => {
      const vacRes = await service.getVacancies();
      const vacBody = await vacRes.json().catch(() => ({}));
      const vacancies = vacBody.data ?? vacBody ?? [];
      const firstVacancyId = vacancies[0]?.id ?? null;
      const payload = {
        firstName: candidateData.firstName,
        lastName: candidateData.lastName,
        email: candidateData.email,
      };
      if (firstVacancyId != null) payload.vacancyId = firstVacancyId;

      const createRes = await service.createCandidate(payload);
      const createBody = await createRes.json().catch(() => ({}));
      id = createBody.data?.id ?? createBody.id;
      expect(id).toBeDefined();
    });

    await test.step('GET candidate by id and verify data', async () => {
      const getRes = await service.getCandidate(id);
      expect(getRes.ok()).toBeTruthy();
      const getBody = await getRes.json().catch(() => ({}));
      expect(getBody.data?.firstName ?? getBody.firstName).toBe(candidateData.firstName);
    });
  });
});
