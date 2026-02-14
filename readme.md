# qa-guru-hrm-automation

Automated QA for [OrangeHRM](https://www.orangehrm.com/) using Playwright. This repository contains UI and API tests for OrangeHRM 5.8.

## Table of contents

- [Repository description](#repository-description)
- [Tech stack](#tech-stack)
- [Test cases](#test-cases)
- [Running tests](#running-tests)
- [Reports](#reports)
- [GitHub Actions](#github-actions)
- [Report examples](#report-examples)
- [How to run](#how-to-run)

## Repository description

This repo provides automated tests for **OrangeHRM**, an open-source Human Resource Management system. The tested application is **OrangeHRM 5.8**, which covers employee management (PIM), job titles, recruitment (vacancies and candidates), and authentication.

The project runs the application via **Docker** (MariaDB + OrangeHRM image). Tests can be executed locally against a running stack or inside Docker; CI runs the full stack and tests in containers.

## Tech stack

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=flat&logo=playwright&logoColor=white)
![Allure](https://img.shields.io/badge/Allure-EA5936?style=flat&logo=allure&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-1A2B34?style=flat&logo=prettier&logoColor=white)

- **Node.js** — runtime
- **Playwright** — test runner (UI and API)
- **Allure** — reporting (Allure Report and Allure TestOps)
- **Docker / Docker Compose** — OrangeHRM, MariaDB, and test runner
- **ESLint / Prettier** — lint and format
- **@faker-js/faker** — test data
- **dotenv** — environment configuration

## Test cases

| Type | Block | Test case |
|------|-------|-----------|
| UI | Authorization | Login with valid credentials and land on dashboard |
| UI | Authorization | Show error on invalid credentials |
| UI | PIM (Admin / Job Titles) | Create job title in admin panel |
| UI | Recruitment | Create vacancy |
| UI | Recruitment | Edit vacancy |
| UI | Recruitment | Delete vacancy |
| UI | Recruitment | Bulk delete vacancies |
| API | Authorization | Get login page and have session cookie after login |
| API | PIM (Employees) | Create employee via API |
| API | PIM (Employees) | Get employee by id after create |
| API | Recruitment | Get vacancies list via API |
| API | Recruitment | Create candidate via API |
| API | Recruitment | Get candidate by id after create |

## Running tests

Ensure OrangeHRM is running (e.g. via Docker) and the installer has been executed. Use `.env` or `.env.test` with `BASE_URL`, `API_BASE_URL`, `TEST_USER_USERNAME`, `TEST_USER_PASSWORD`. For local runs against the app on the host, use `BASE_URL=http://localhost:8080`.

Run all tests:

```bash
npm run test
```

Run only UI tests:

```bash
npm run test:ui
```

Run only API tests:

```bash
npm run test:api
```

Run tests in Docker (app stack must be up; installer run once):

```bash
docker compose run --rm tests
```

To run only UI or API inside the container, override the command:

```bash
docker compose run --rm tests npm run test:ui
```

```bash
docker compose run --rm tests npm run test:api
```

## Reports

Generate Allure report from `allure-results` into `allure-report` (clean):

```bash
npm run allure:generate
```

Serve Allure report from `allure-results` in the browser:

```bash
npm run allure:serve
```

Send results to Allure TestOps (set `ALLURE_ENDPOINT`, `ALLURE_TOKEN`, `ALLURE_PROJECT_ID`):

```bash
npm run allure:send
```

Send summary and donut chart to Telegram (set `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`; uses `allure-report/summary.json`):

```bash
npm run allure:telegram
```

Open Playwright HTML report:

```bash
npm run report
```

## GitHub Actions

Workflow **CI playwright tests** (`.github/workflows/ci.yml`) runs on push and pull requests to `main` and on `workflow_dispatch`.

Steps: 
Сheckout → install and configure allurectl (Allure TestOps) → start `db` and `orangehrm` with Docker Compose → wait for OrangeHRM → run CLI installer → `npm ci` → Playwright install → run tests in Docker with mounted `allure-results`, `test-results`, `playwright-report` → upload results to Allure TestOps → generate Allure single-file report → upload artifact (allure-report, allure-results, playwright-report) → deploy Allure report to GitHub Pages (on push to main or workflow_dispatch) → send Telegram notification.

Required repository secrets: `ALLURE_ENDPOINT`, `ALLURE_PROJECT_ID`, `ALLURE_TOKEN`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`.

## Report examples

**Allure report** — Suites, test names, status, duration, steps, and attachments (screenshots, traces). After a run, use `npm run allure:serve` or open the CI artifact / GitHub Pages report.

**Allure TestOps** — Launches are uploaded via allurectl. View results, trends, and history in the Allure TestOps project.

**Telegram** — The notification includes project name, environment, duration, total/passed/failed/broken/skipped counts, a link to the report (e.g. GitHub Pages), and a donut chart (QuickChart) built from the summary. Implemented in `scripts/send-allure-to-telegram.js` and `scripts/build-chart-url.js`.

## How to run

For a detailed step-by-step run guide, see [HOW_TO_RUN_GUIDE.md](HOW_TO_RUN_GUIDE.md).
