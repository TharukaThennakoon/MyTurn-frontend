import apiClient, { ApiResponse } from "./apiClient";

export interface DashboardResponse {
  stationId: number;
  stationName: string;
  totalBookingsToday: number;
  activeQueueCount: number;
  servedCountToday: number;
  avgWaitTimeMinutes: number;
  fuelInventoryStatus: Record<string, number>;
}

export const dashboardService = {
  /**
   * Get dashboard data for station/admin
   */
  getDashboardData: (stationId: number): Promise<ApiResponse<DashboardResponse>> =>
    apiClient.get<DashboardResponse>("/dashboard", { stationId }),
};

export default dashboardService;
