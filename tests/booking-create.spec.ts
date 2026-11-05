import { test, expect } from '../src/fixtures';
import { buildBooking } from '../src/data/bookingFactory';
import { Booking, CreateBookingResponse } from '../src/types/booking';

test.describe('Create booking', { tag: '@booking' }, () => {
  test('POST /booking creates a booking', { tag: '@smoke' }, async ({ api, token }) => {
    const payload = buildBooking();

    const response = await api.createBooking(payload);

    expect(response.status()).toBe(200);
    const body = (await response.json()) as CreateBookingResponse;
    expect(body.bookingid).toEqual(expect.any(Number));
    expect(body.booking).toEqual(payload);

    await api.deleteBooking(body.bookingid, token); // cleanup
  });

  test('a created booking can be fetched by id', async ({ api, booking }) => {
    const response = await api.getBooking(booking.id);

    expect(response.status()).toBe(200);
    expect((await response.json()) as Booking).toEqual(booking.payload);
  });

  test('POST /booking fails when a required field is missing', async ({ api }) => {
    const { firstname: _omitted, ...incomplete } = buildBooking();

    const response = await api.createBooking(incomplete as Booking);

    // Restful-Booker answers 500 for an invalid payload.
    expect(response.status()).toBe(500);
  });
});
