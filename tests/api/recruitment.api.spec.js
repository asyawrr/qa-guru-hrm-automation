import { test, expect } from '../../src/helpers/fixtures/playwright.fixture.js';
import { CandidateBuilder } from '../../src/helpers/builders/index.js';

test.describe('API Recruitment', () => {
  test('Get vacancies list via API', async ({ recruitmentService }) => {
    const response = await recruitmentService.getVacancies({});
    const body = await response.json().catch(() => ({}));
    expect(response.ok()).toBeTruthy();
    expect(Array.isArray(body.data ?? body)).toBeTruthy();
  });

  test('Create candidate via API', async ({ recruitmentService }) => {
    const candidateData = new CandidateBuilder()
      .withFirstName('Api')
      .withLastName('Candidate')
      .withEmail(`api.cand.${Date.now()}@test.com`)
      .build();

    const vacRes = await recruitmentService.getVacancies({});
    const vacBody = await vacRes.json().catch(() => ({}));
    const vacancies = vacBody.data ?? vacBody ?? [];
    const firstVacancyId = vacancies[0]?.id ?? null;
    const payload = {
      firstName: candidateData.firstName,
      lastName: candidateData.lastName,
      email: candidateData.email,
    };
    if (firstVacancyId != null) payload.vacancyId = firstVacancyId;

    const response = await recruitmentService.createCandidate(payload);
    const body = await response.json().catch(() => ({}));

    expect(response.ok(), body?.message ?? JSON.stringify(body)).toBeTruthy();
    expect(body.data?.firstName ?? body.firstName).toBe(candidateData.firstName);
  });

  test('Get candidate by id after create', async ({ recruitmentService }) => {
    const candidateData = new CandidateBuilder()
      .withFirstName('GetCand')
      .withLastName('Id')
      .withEmail(`getcand.${Date.now()}@test.com`)
      .build();

    const vacRes = await recruitmentService.getVacancies({});
    const vacBody = await vacRes.json().catch(() => ({}));
    const vacancies = vacBody.data ?? vacBody ?? [];
    const firstVacancyId = vacancies[0]?.id ?? null;
    const payload = {
      firstName: candidateData.firstName,
      lastName: candidateData.lastName,
      email: candidateData.email,
    };
    if (firstVacancyId != null) payload.vacancyId = firstVacancyId;

    const createRes = await recruitmentService.createCandidate(payload);
    expect(createRes.ok(), `Create failed: ${createRes.status()}`).toBeTruthy();

    const createBody = await createRes.json().catch(() => ({}));
    const id = createBody.data?.id ?? createBody.data?.candidateId ?? createBody.id ?? createBody.candidateId;
    expect(id, `No id in response: ${JSON.stringify(createBody)}`).toBeDefined();

    const getRes = await recruitmentService.getCandidate(id);
    expect(getRes.ok()).toBeTruthy();
    const getBody = await getRes.json().catch(() => ({}));
    expect(getBody.data?.firstName ?? getBody.firstName).toBe(candidateData.firstName);
  });
});
