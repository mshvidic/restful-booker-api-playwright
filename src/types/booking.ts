export interface BookingDates {
  checkin: string;
  checkout: string;
}

export interface Booking {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds?: string;
}

export interface CreateBookingResponse {
  bookingid: number;
  booking: Booking;
}

export interface BookingIdEntry {
  bookingid: number;
}

export interface BookingQuery {
  firstname?: string;
  lastname?: string;
  checkin?: string;
  checkout?: string;
}

export interface AuthResponse {
  token?: string;
  reason?: string;
}
