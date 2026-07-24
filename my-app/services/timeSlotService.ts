import apiClient, { ApiResponse } from "./apiClient";
import { TimeSlotResponse } from "./stationService";

export interface CreateTimeSlotRequest {
  startTime: string;
  endTime: string;
  maxCapacity: number;
}

export const timeSlotService = {
  /**
   * Create a time slot for a station (Admin)
   */
  createSlot: (stationId: number, data: CreateTimeSlotRequest): Promise<ApiResponse<TimeSlotResponse>> =>
    apiClient.post<TimeSlotResponse>("/timeslots", data, { params: { stationId } }),

  /**
   * Get all time slots for a station on a given date
   */
  getAllSlotsForDate: (stationId: number, date: string): Promise<ApiResponse<TimeSlotResponse[]>> =>
    apiClient.get<TimeSlotResponse[]>("/timeslots", { stationId, date }),

  /**
   * Update time slot status (Admin)
   */
  updateSlotStatus: (id: number, status: "AVAILABLE" | "FULL" | "CLOSED"): Promise<ApiResponse<TimeSlotResponse>> =>
    apiClient.put<TimeSlotResponse>(`/timeslots/${id}`, undefined, { params: { status } }),

  /**
   * Delete a time slot (Admin)
   */
  deleteSlot: (id: number): Promise<ApiResponse<void>> =>
    apiClient.delete<void>(`/timeslots/${id}`),
};

export default timeSlotService;
