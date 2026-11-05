import { test, expect } from '../src/fixtures';
import { Booking, BookingIdEntry } from '../src/types/booking';

test.describe('Read bookings', { tag: '@booking' }, () => {
  test('GET /booking returns a list of booking ids', { tag: '@smoke' }, async ({ api }) => {
    const response = await api.getBookingIds();

    expect(response.status()).toBe(200);
    const ids = (await response.json()) as BookingIdEntry[];
    expect(Array.isArray(ids)).toBe(true);
    expect(ids.length).toBeGreaterThan(0);
    for (const entry of ids) {
      expect(entry.bookingid).toEqual(expect.any(Number));
    }
  });

  test('GET /booking/:id returns the booking', { tag: '@smoke' }, async ({ api, booking }) => {
    const response = await api.getBooking(booking.id);

    expect(response.status()).toBe(200);
    expect((await response.json()) as Booking).toEqual(booking.payload);
  });

  test('GET /booking can be filtered by first name', async ({ api, booking }) => {
    const response = await api.getBookingIds({ firstname: booking.payload.firstname });

    expect(response.status()).toBe(200);
    const ids = ((await response.json()) as BookingIdEntry[]).map((e) => e.bookingid);
    expect(ids).toContain(booking.id);
  });

  test('GET /booking can be filtered by last name', async ({ api, booking }) => {
    const response = await api.getBookingIds({ lastname: booking.payload.lastname });

    expect(response.status()).toBe(200);
    const ids = ((await response.json()) as BookingIdEntry[]).map((e) => e.bookingid);
    expect(ids).toContain(booking.id);
  });

  test('GET /booking/:id returns 404 for an unknown id', async ({ api }) => {
    const response = await api.getBooking(999_999_999);

    expect(response.status()).toBe(404);
  });
});
