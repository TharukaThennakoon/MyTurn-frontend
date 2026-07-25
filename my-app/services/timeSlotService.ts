import apiClient, { ApiResponse } from "./apiClient";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SlotStatus = "OPEN" | "FULL" | "CLOSED" | "BLOCKED";

export type FuelType = "PETROL92" | "PETROL95" | "DIESEL" | "SUPER_DIESEL";

export interface TimeSlotResponse {
  id: number;
  slotDate: string;        // "YYYY-MM-DD"
  startTime: string;       // "HH:mm:ss"
  endTime: string;         // "HH:mm:ss"
  fuelType: FuelType;
  totalCapacity: number;
  availableCapacity: number;
  status: SlotStatus;
  bookable: boolean;
}

export interface CreateTimeSlotRequest {
  slotDate: string;        // "YYYY-MM-DD"
  startTime: string;       // "HH:mm:ss"
  endTime: string;         // "HH:mm:ss"
  fuelType: FuelType;
  totalCapacity: number;
}

export interface UpdateTimeSlotRequest {
  slotDate: string;
  startTime: string;
  endTime: string;
  fuelType: FuelType;
  totalCapacity: number;
  status?: SlotStatus;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const timeSlotService = {
  /**
   * Create a single time slot for a station (Admin)
   */
  createSlot: (
    stationId: number,
    data: CreateTimeSlotRequest
  ): Promise<ApiResponse<TimeSlotResponse>> =>
    apiClient.post<TimeSlotResponse>("/timeslots", data, {
      params: { stationId },
    }),

  /**
   * Get all time slots for a station on a given date
   */
  getAllSlotsForDate: (
    stationId: number,
    date: string
  ): Promise<ApiResponse<TimeSlotResponse[]>> =>
    apiClient.get<TimeSlotResponse[]>("/timeslots", { stationId, date }),

  /**
   * Update only the status of a time slot — quick block/unblock (Admin)
   */
  updateSlotStatus: (
    id: number,
    status: SlotStatus
  ): Promise<ApiResponse<TimeSlotResponse>> =>
    apiClient.put<TimeSlotResponse>(`/timeslots/${id}`, undefined, {
      params: { status },
    }),

  /**
   * Update full details of a time slot (Admin)
   */
  updateSlotDetails: (
    id: number,
    data: UpdateTimeSlotRequest
  ): Promise<ApiResponse<TimeSlotResponse>> =>
    apiClient.put<TimeSlotResponse>(`/timeslots/${id}/details`, data),

  /**
   * Bulk-generate all slots for a station on a date from station hours (Admin)
   */
  generateSlotsForDate: (
    stationId: number,
    date: string
  ): Promise<ApiResponse<TimeSlotResponse[]>> =>
    apiClient.post<TimeSlotResponse[]>("/timeslots/generate", undefined, {
      params: { stationId, date },
    }),

  /**
   * Delete a time slot (Admin) — only allowed when no active bookings
   */
  deleteSlot: (id: number): Promise<ApiResponse<void>> =>
    apiClient.delete<void>(`/timeslots/${id}`),
};

export default timeSlotService;
