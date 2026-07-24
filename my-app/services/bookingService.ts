import apiClient, { ApiResponse } from "./apiClient";

export interface CreateBookingRequest {
  stationId: number;
  timeSlotId: number;
  fuelType: string;
  requestedLiters: number;
  vehicleNumber: string;
}

export interface BookingResponse {
  id: string;
  userId: number;
  stationId: number;
  stationName?: string;
  timeSlotId: number;
  slotStartTime?: string;
  slotEndTime?: string;
  fuelType: string;
  requestedLiters: number;
  vehicleNumber: string;
  status: "CONFIRMED" | "CANCELLED" | "COMPLETED" | "SERVED" | "EXPIRED";
  qrCodeUrl?: string;
  queuePosition?: number;
  estimatedWaitMinutes?: number;
  createdAt: string;
}

export const bookingService = {
  /**
   * Create a new appointment booking
   */
  createBooking: (data: CreateBookingRequest): Promise<ApiResponse<BookingResponse>> =>
    apiClient.post<BookingResponse>("/bookings", data),

  /**
   * Get authenticated user's current active booking
   */
  getActiveBooking: (): Promise<ApiResponse<BookingResponse>> =>
    apiClient.get<BookingResponse>("/bookings/active"),

  /**
   * Get authenticated user's booking history
   */
  getBookingHistory: (): Promise<ApiResponse<BookingResponse[]>> =>
    apiClient.get<BookingResponse[]>("/bookings/history"),

  /**
   * Get specific booking details by ID
   */
  getBookingById: (bookingId: string): Promise<ApiResponse<BookingResponse>> =>
    apiClient.get<BookingResponse>(`/bookings/${bookingId}`),

  /**
   * Cancel an active booking
   */
  cancelBooking: (bookingId: string): Promise<ApiResponse<BookingResponse>> =>
    apiClient.patch<BookingResponse>(`/bookings/${bookingId}/cancel`),
};

export default bookingService;
