import apiClient, { ApiResponse } from "./apiClient";

// ── Enums matching the backend exactly ────────────────────────────────────────
// Backend: com.myturn.myturn.enums.FuelType
export type FuelType = "PETROL92" | "PETROL95" | "DIESEL" | "SUPER_DIESEL";

// Backend: com.myturn.myturn.enums.BookingStatus
export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "SERVING"
  | "COMPLETED"
  | "CANCELLED"
  | "MISSED"
  | "EXPIRED";

// ── Request DTO — matches CreateBookingRequest.java ────────────────────────────
// Backend @NotNull fields: stationId, vehicleId, fuelType, timeSlotId
export interface CreateBookingRequest {
  stationId: number;
  vehicleId: number;   // NOT vehicleNumber — backend looks up vehicle by ID
  fuelType: FuelType;
  timeSlotId: number;  // matches Java field name exactly (camelCase)
}

// ── Digital token nested inside BookingResponse ────────────────────────────────
export interface DigitalTokenResponse {
  id: string;
  tokenNumber: string;
  qrCodeData: string;
  status: string;
  expiresAt: string;
  checkedInAt?: string;
  createdAt: string;
}

// ── Response DTO — mirrors BookingResponse.java exactly ───────────────────────
export interface BookingResponse {
  id: string;                   // UUID
  bookingReference: string;     // e.g. "MYT-BK-000001"
  stationId: number;
  stationName: string;
  stationAddress?: string;
  vehicleId: number;
  vehicleNumber: string;
  fuelType: FuelType;
  status: BookingStatus;
  timeSlotId: number;
  slotDate: string;             // "2026-07-26"
  slotStartTime: string;        // "08:00:00"
  slotEndTime: string;
  queuePosition: number;
  estimatedWaitMinutes: number;
  confirmedAt?: string;
  checkedInAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  createdAt: string;
  digitalToken?: DigitalTokenResponse;
}

// ── Service ───────────────────────────────────────────────────────────────────
export const bookingService = {
  /**
   * POST /api/v1/bookings
   * Create a new appointment booking.
   * vehicleId comes from the user object stored at login (res.data.vehicleId).
   */
  createBooking: (data: CreateBookingRequest): Promise<ApiResponse<BookingResponse>> =>
    apiClient.post<BookingResponse>("/bookings", data),

  /**
   * GET /api/v1/bookings/active
   * Returns the user's current active booking (PENDING / CONFIRMED / CHECKED_IN / SERVING).
   */
  getActiveBooking: (): Promise<ApiResponse<BookingResponse>> =>
    apiClient.get<BookingResponse>("/bookings/active"),

  /**
   * GET /api/v1/bookings/history
   * Returns all bookings for the user, newest first.
   */
  getBookingHistory: (): Promise<ApiResponse<BookingResponse[]>> =>
    apiClient.get<BookingResponse[]>("/bookings/history"),

  /**
   * GET /api/v1/bookings/{bookingId}
   * Returns a single booking by UUID.
   */
  getBookingById: (bookingId: string): Promise<ApiResponse<BookingResponse>> =>
    apiClient.get<BookingResponse>(`/bookings/${bookingId}`),

  /**
   * PATCH /api/v1/bookings/{bookingId}/cancel
   * Cancels an active booking. Restores slot capacity and cancels queue entry.
   */
  cancelBooking: (bookingId: string): Promise<ApiResponse<BookingResponse>> =>
    apiClient.patch<BookingResponse>(`/bookings/${bookingId}/cancel`),
};

export default bookingService;
