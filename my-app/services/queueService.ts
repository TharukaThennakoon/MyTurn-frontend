import apiClient, { ApiResponse } from "./apiClient";

export interface QueueResponse {
  id: number;
  userId: number;
  bookingId: string;
  stationId: number;
  tokenNumber: string;
  queuePosition: number;
  status: "WAITING" | "CHECKED_IN" | "SERVING" | "COMPLETED" | "CANCELLED";
  estimatedWaitMinutes: number;
  joinedAt: string;
}

export interface QrVerificationRequest {
  qrToken: string;
  stationId: number;
}

export const queueService = {
  /**
   * Join queue for a confirmed booking
   */
  joinQueue: (userId: number, bookingId: string): Promise<ApiResponse<QueueResponse>> =>
    apiClient.post<QueueResponse>("/queue/join", undefined, { params: { userId, bookingId } }),

  /**
   * Get current live queue status for user
   */
  getQueueStatus: (userId: number): Promise<ApiResponse<QueueResponse>> =>
    apiClient.get<QueueResponse>("/queue/status", { userId }),

  /**
   * QR verification & Check-in at station (Station operator / User)
   */
  checkIn: (data: QrVerificationRequest): Promise<ApiResponse<QueueResponse>> =>
    apiClient.post<QueueResponse>("/queue/check-in", data),

  /**
   * Mark vehicle as currently being served (Operator)
   */
  serveVehicle: (queueId: number): Promise<ApiResponse<QueueResponse>> =>
    apiClient.post<QueueResponse>("/queue/serve", undefined, { params: { queueId } }),

  /**
   * Complete vehicle fueling & queue session (Operator)
   */
  completeQueue: (queueId: number): Promise<ApiResponse<QueueResponse>> =>
    apiClient.post<QueueResponse>("/queue/complete", undefined, { params: { queueId } }),
};

export default queueService;
