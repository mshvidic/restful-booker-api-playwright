import { test, expect } from '../src/fixtures';

test.describe('Health check', { tag: '@health' }, () => {
  test('GET /ping reports the API is up', { tag: '@smoke' }, async ({ api }) => {
    const response = await api.ping();

    // Restful-Booker answers 201 "Created" for its health check.
    expect(response.status()).toBe(201);
    expect(await response.text()).toBe('Created');
  });
});
