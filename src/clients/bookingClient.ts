import { APIRequestContext, APIResponse, test } from '@playwright/test';
import { Booking, BookingQuery } from '../types/booking';

/**
 * Thin wrapper over Restful-Booker endpoints.
 * Every call is wrapped in a test.step and its response is attached,
 * so each request shows up in the Allure report with status and body.
 */
export class BookingClient {
  constructor(private readonly request: APIRequestContext) {}

  private static authHeaders(token: string): Record<string, string> {
    return { Cookie: `token=${token}` };
  }

  private async call(name: string, send: () => Promise<APIResponse>): Promise<APIResponse> {
    return test.step(name, async () => {
      const response = await send();
      await test.info().attach(`${name} - response`, {
        body: `HTTP ${response.status()} ${response.statusText()}\n\n${await response.text()}`,
        contentType: 'text/plain',
      });
      return response;
    });
  }

  /** GET /ping */
  ping(): Promise<APIResponse> {
    return this.call('GET /ping', () => this.request.get('/ping'));
  }

  /** POST /auth */
  createToken(username: string, password: string): Promise<APIResponse> {
    return this.call('POST /auth', () =>
      this.request.post('/auth', { data: { username, password } }),
    );
  }

  /** GET /booking (optionally filtered by name or dates) */
  getBookingIds(query: BookingQuery = {}): Promise<APIResponse> {
    return this.call('GET /booking', () =>
      this.request.get('/booking', { params: { ...query } }),
    );
  }

  /** GET /booking/:id */
  getBooking(id: number): Promise<APIResponse> {
    return this.call(`GET /booking/${id}`, () => this.request.get(`/booking/${id}`));
  }

  /** POST /booking */
  createBooking(booking: Booking): Promise<APIResponse> {
    return this.call('POST /booking', () => this.request.post('/booking', { data: booking }));
  }

  /** PUT /booking/:id (full update, requires auth) */
  updateBooking(id: number, booking: Booking, token?: string): Promise<APIResponse> {
    return this.call(`PUT /booking/${id}`, () =>
      this.request.put(`/booking/${id}`, {
        data: booking,
        headers: token ? BookingClient.authHeaders(token) : undefined,
      }),
    );
  }

  /** PATCH /booking/:id (partial update, requires auth) */
  partialUpdateBooking(
    id: number,
    changes: Partial<Booking>,
    token?: string,
  ): Promise<APIResponse> {
    return this.call(`PATCH /booking/${id}`, () =>
      this.request.patch(`/booking/${id}`, {
        data: changes,
        headers: token ? BookingClient.authHeaders(token) : undefined,
      }),
    );
  }

  /** DELETE /booking/:id (requires auth) */
  deleteBooking(id: number, token?: string): Promise<APIResponse> {
    return this.call(`DELETE /booking/${id}`, () =>
      this.request.delete(`/booking/${id}`, {
        headers: token ? BookingClient.authHeaders(token) : undefined,
      }),
    );
  }
}
