import { test, expect } from '../src/fixtures';

test.describe('Delete booking', { tag: '@booking' }, () => {
  test('DELETE /booking/:id removes the booking', { tag: '@smoke' }, async ({ api, booking, token }) => {
    const response = await api.deleteBooking(booking.id, token);

    // Restful-Booker answers 201 "Created" for a successful delete.
    expect(response.status()).toBe(201);

    const check = await api.getBooking(booking.id);
    expect(check.status()).toBe(404);
  });

  test('DELETE /booking/:id is forbidden without authentication', async ({ api, booking }) => {
    const response = await api.deleteBooking(booking.id);

    expect(response.status()).toBe(403);

    const check = await api.getBooking(booking.id);
    expect(check.status()).toBe(200);
  });
});
