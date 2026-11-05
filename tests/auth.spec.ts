import { test, expect } from '../src/fixtures';
import { ADMIN_CREDENTIALS } from '../src/data/bookingFactory';
import { AuthResponse } from '../src/types/booking';

test.describe('Auth', { tag: '@auth' }, () => {
  test('POST /auth returns a token for valid credentials', { tag: '@smoke' }, async ({ api }) => {
    const response = await api.createToken(ADMIN_CREDENTIALS.username, ADMIN_CREDENTIALS.password);

    expect(response.status()).toBe(200);
    const body = (await response.json()) as AuthResponse;
    expect(body.token).toEqual(expect.any(String));
    expect(body.token).not.toHaveLength(0);
  });

  test('POST /auth rejects invalid credentials', async ({ api }) => {
    const response = await api.createToken('admin', 'wrong-password');

    // Restful-Booker answers 200 with a "reason" instead of an error status.
    expect(response.status()).toBe(200);
    const body = (await response.json()) as AuthResponse;
    expect(body.token).toBeUndefined();
    expect(body.reason).toBe('Bad credentials');
  });
});
