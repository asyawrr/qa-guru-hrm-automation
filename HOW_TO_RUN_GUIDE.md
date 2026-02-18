# How to run the project

This guide describes how to run the project **locally** (tests on your machine, OrangeHRM in Docker) and **via Docker** (tests inside a container). All commands are in code blocks for copy-paste. For secrets (Allure TestOps, Telegram) and CI details, see [README.md](README.md).

## Prerequisites

Node.js 18+, Docker and Docker Compose, Git.

## Clone and install dependencies

```bash
git clone https://github.com/asyawrr/qa-guru-hrm-automation.git
```

```bash
cd qa-guru-hrm-automation
```

```bash
npm ci
```

---

## Run locally

Tests run on your host; OrangeHRM runs in Docker. Use this when you develop or debug tests on your machine.

**Configure environment for local runs**

Copy `.env.test.example` to `.env` (or `.env.test`) and fill in the variables. For local runs against the app on the host, use for example:

```bash
BASE_URL=http://localhost:8080
API_BASE_URL=http://localhost:8080/web/index.php/api/v2
TEST_USER_USERNAME=<your test user>
TEST_USER_PASSWORD=<your test password>
```

**Start OrangeHRM (Docker)**

```bash
docker compose up -d db orangehrm
```

Wait until the app is ready (e.g. `curl -s -o /dev/null -w "%{http_code}" http://localhost:8080` returns 200). Then run the CLI installer once:

```bash
docker compose exec -T orangehrm php installer/cli_install.php
```

**Install Playwright browsers**

```bash
npx playwright install --with-deps
```

**Run tests on host**

All tests:

```bash
npm run test
```

UI only:

```bash
npm run test:ui
```

API only:

```bash
npm run test:api
```

**Reports (local)**

```bash
npm run allure:serve
```

```bash
npm run report
```

---

## Run via Docker

Tests run inside the `tests` container; OrangeHRM and DB run in Docker. Use this for a full containerized run (e.g. CI-like).

**Configure environment for Docker**

Copy `.env.test.example` to `.env.test` and set the variables. The `tests` service loads them from `.env.test` via `env_file`. For Docker runs, use the OrangeHRM service hostname, e.g.:

```bash
BASE_URL=http://orangehrm:80
API_BASE_URL=http://orangehrm:80/web/index.php/api/v2
TEST_USER_USERNAME=Admin
TEST_USER_PASSWORD=Admin123!-Admin123!
```

**Start OrangeHRM and run installer**

```bash
docker compose up -d db orangehrm
```

Wait for the app (e.g. http://localhost:8080 returns 200), then run the installer once:

```bash
docker compose exec -T orangehrm php installer/cli_install.php
```

**Run tests in Docker**

All tests:

```bash
docker compose run --rm tests
```

UI only:

```bash
docker compose run --rm tests npm run test:ui
```

API only:

```bash
docker compose run --rm tests npm run test:api
```

**Reports after Docker run**

Artifacts are written to `allure-results`, `test-results`, `playwright-report` in the project root (mounted from the container). Generate and open Allure report on the host:

```bash
npm run allure:generate
```

```bash
npm run allure:serve
```

```bash
npm run report
```

---

## Optional: Telegram notification

Set environment variables:

```bash
export TELEGRAM_BOT_TOKEN=your_bot_token
export TELEGRAM_CHAT_ID=your_chat_id
```

Ensure `allure-report/summary.json` exists (run `npm run allure:generate` after tests if needed). Then:

```bash
npm run allure:telegram
```

See [README.md](README.md) for Allure TestOps and Telegram setup.
