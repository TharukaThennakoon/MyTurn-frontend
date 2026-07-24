import apiClient, { ApiResponse } from "./apiClient";

export interface NotificationResponse {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: "INFO" | "SUCCESS" | "WARNING" | "ALERT" | "BOOKING_CONFIRMED" | "QUEUE_UPDATE";
  isRead: boolean;
  createdAt: string;
}

export const notificationService = {
  /**
   * Get all notifications for user
   */
  getUserNotifications: (userId: number): Promise<ApiResponse<NotificationResponse[]>> =>
    apiClient.get<NotificationResponse[]>("/notifications", { userId }),

  /**
   * Send notification manually (Admin)
   */
  sendNotification: (
    userId: number,
    title: string,
    message: string,
    type: string
  ): Promise<ApiResponse<void>> =>
    apiClient.post<void>("/notifications", undefined, { params: { userId, title, message, type } }),

  /**
   * Mark notification as read
   */
  markAsRead: (id: number, userId: number): Promise<ApiResponse<void>> =>
    apiClient.patch<void>(`/notifications/${id}/read`, undefined, { params: { userId } }),
};

export default notificationService;
