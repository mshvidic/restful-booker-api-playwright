import { test, expect } from '../src/fixtures';
import { buildBooking } from '../src/data/bookingFactory';
import { Booking } from '../src/types/booking';

test.describe('Update booking', { tag: '@booking' }, () => {
  test('PUT /booking/:id replaces the booking', { tag: '@smoke' }, async ({ api, booking, token }) => {
    const replacement = buildBooking({ totalprice: 999, depositpaid: false });

    const response = await api.updateBooking(booking.id, replacement, token);

    expect(response.status()).toBe(200);
    expect((await response.json()) as Booking).toEqual(replacement);

    const check = await api.getBooking(booking.id);
    expect((await check.json()) as Booking).toEqual(replacement);
  });

  test('PUT /booking/:id is forbidden without authentication', async ({ api, booking }) => {
    const response = await api.updateBooking(booking.id, buildBooking());

    expect(response.status()).toBe(403);
  });

  test('PATCH /booking/:id changes only the given fields', async ({ api, booking, token }) => {
    const changes = { firstname: 'Patched', lastname: 'Booker' };

    const response = await api.partialUpdateBooking(booking.id, changes, token);

    expect(response.status()).toBe(200);
    expect((await response.json()) as Booking).toEqual({ ...booking.payload, ...changes });
  });

  test('PATCH /booking/:id is forbidden without authentication', async ({ api, booking }) => {
    const response = await api.partialUpdateBooking(booking.id, { firstname: 'Nope' });

    expect(response.status()).toBe(403);
  });
});
