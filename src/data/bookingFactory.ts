import { Booking } from '../types/booking';

export const ADMIN_CREDENTIALS = {
  username: process.env.API_USERNAME ?? 'admin',
  password: process.env.API_PASSWORD ?? 'password123',
};

function uniqueSuffix(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

/** Builds a valid booking payload. Names are unique so filter tests can find "their" booking. */
export function buildBooking(overrides: Partial<Booking> = {}): Booking {
  const suffix = uniqueSuffix();
  return {
    firstname: `Jim${suffix}`,
    lastname: `Brown${suffix}`,
    totalprice: 111,
    depositpaid: true,
    bookingdates: {
      checkin: '2026-01-01',
      checkout: '2026-01-05',
    },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}
