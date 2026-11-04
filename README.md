# Restful-Booker API Tests

A small API test automation framework for [Restful-Booker](https://restful-booker.herokuapp.com/apidoc/index.html), built with **Playwright Test** (TypeScript) and **Allure** reporting.

## What's inside

- **Playwright `request` context** for API calls (no browser needed)
- **Typed API client** (`BookingClient`) wrapping every endpoint; each call is a `test.step` with its response attached, so requests are visible in the Allure report
- **Fixtures** for an API client, an admin auth token, and a pre-created booking that is cleaned up automatically
- **Test data factory** producing unique bookings per test, so tests can run in parallel safely
- **Tags**: `@smoke` on the critical tests, plus feature tags (`@auth`, `@booking`, `@health`)
- **Allure** results, HTML report generation and a local viewer

## Covered endpoints

| Method | Endpoint | Covered by |
| --- | --- | --- |
| GET | `/ping` | `health.spec.ts` |
| POST | `/auth` | `auth.spec.ts` |
| GET | `/booking` (with `firstname` / `lastname` filters) | `booking-read.spec.ts` |
| GET | `/booking/:id` | `booking-read.spec.ts` |
| POST | `/booking` | `booking-create.spec.ts` |
| PUT | `/booking/:id` | `booking-update.spec.ts` |
| PATCH | `/booking/:id` | `booking-update.spec.ts` |
| DELETE | `/booking/:id` | `booking-delete.spec.ts` |

Both positive and negative cases are included (invalid credentials, missing auth, unknown id, invalid payload). Filtering by date (`checkin` / `checkout`) is not covered.

## Project structure

```
.
├── playwright.config.ts        # base URL, headers, reporters (list + allure)
├── tsconfig.json
├── package.json
├── src/
│   ├── clients/bookingClient.ts   # API wrapper, steps + response attachments
│   ├── data/bookingFactory.ts     # payload builder and admin credentials
│   ├── fixtures/index.ts          # api, token and booking fixtures
│   └── types/booking.ts           # request/response types
└── tests/
    ├── health.spec.ts
    ├── auth.spec.ts
    ├── booking-create.spec.ts
    ├── booking-read.spec.ts
    ├── booking-update.spec.ts
    └── booking-delete.spec.ts
```

## Prerequisites

- Node.js 18 or newer
- Java 8 or newer (required by `allure-commandline` to generate the report)
- Network access to `https://restful-booker.herokuapp.com`

## Setup

```bash
npm install
```

No browsers are needed, so `npx playwright install` is not required.

## Running tests

```bash
npm test                  # all tests
npm run test:smoke        # only tests tagged @smoke
npm run test:regression   # everything except @smoke
npx playwright test --grep @booking     # one feature area
npx playwright test tests/auth.spec.ts  # one file
```

## Allure report

Running the tests writes raw results to `allure-results/`. Then either:

```bash
npm run allure:serve      # generate a temporary report and open it in the browser
```

or generate a static report:

```bash
npm run allure:generate   # builds ./allure-report
npm run allure:open       # opens it
```

Use `npm run clean` to delete `allure-results`, `allure-report` and `test-results` before a fresh run.

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `BASE_URL` | `https://restful-booker.herokuapp.com` | API under test |
| `API_USERNAME` | `admin` | Auth username |
| `API_PASSWORD` | `password123` | Auth password |
| `CI` | unset | When set: 2 retries, 2 workers, `test.only` forbidden |

Example:

```bash
BASE_URL=http://localhost:3001 npm test
```

## Adding a test

1. Add the endpoint call to `src/clients/bookingClient.ts` if it doesn't exist yet.
2. Add a spec in `tests/` and import `test` and `expect` from `../src/fixtures`.
3. Tag critical checks with `{ tag: '@smoke' }`:

   ```ts
   test('GET /ping reports the API is up', { tag: '@smoke' }, async ({ api }) => {
     const response = await api.ping();
     expect(response.status()).toBe(201);
   });
   ```

## Notes on the API under test

Restful-Booker is a deliberately quirky practice API, and the tests assert its actual behaviour:

- `GET /ping` and a successful `DELETE /booking/:id` return **201**
- `POST /auth` with bad credentials returns **200** with `{"reason": "Bad credentials"}`
- `PUT`, `PATCH` and `DELETE` authenticate with a `Cookie: token=<token>` header
- The public instance resets itself every 10 minutes, so tests create their own data instead of relying on pre-loaded bookings
- Because it is a shared public instance, it may occasionally be slow or unavailable; use `BASE_URL` to point at a local copy if needed
