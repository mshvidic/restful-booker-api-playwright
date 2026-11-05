import { test as base, expect } from '@playwright/test';
import { BookingClient } from '../clients/bookingClient';
import { ADMIN_CREDENTIALS, buildBooking } from '../data/bookingFactory';
import { AuthResponse, Booking, CreateBookingResponse } from '../types/booking';

export interface CreatedBooking {
  id: number;
  payload: Booking;
}

type Fixtures = {
  /** API client bound to the configured baseURL. */
  api: BookingClient;
  /** A valid admin token. */
  token: string;
  /** A booking created before the test and deleted afterwards. */
  booking: CreatedBooking;
};

export const test = base.extend<Fixtures>({
  api: async ({ request }, use) => {
    await use(new BookingClient(request));
  },

  token: async ({ api }, use) => {
    const response = await api.createToken(ADMIN_CREDENTIALS.username, ADMIN_CREDENTIALS.password);
    expect(response.status(), 'token request should succeed').toBe(200);
    const body = (await response.json()) as AuthResponse;
    expect(body.token, 'token should be returned').toBeTruthy();
    await use(body.token as string);
  },

  booking: async ({ api, token }, use) => {
    const payload = buildBooking();
    const response = await api.createBooking(payload);
    expect(response.status(), 'booking setup should succeed').toBe(200);
    const { bookingid } = (await response.json()) as CreateBookingResponse;

    await use({ id: bookingid, payload });

    // Cleanup. A test may already have deleted the booking, so the status is not asserted.
    await api.deleteBooking(bookingid, token);
  },
});

export { expect };
