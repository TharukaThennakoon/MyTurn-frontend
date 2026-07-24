import apiClient, { ApiResponse } from "./apiClient";

export interface CreateStationRequest {
  stationName: string;
  address: string;
  city: string;
  district: string;
  contactNumber: string;
  latitude: number;
  longitude: number;
  openingTime: string; // "HH:mm:ss"
  closingTime: string;
  maxVehiclesPerSlot?: number;
  avgServiceTimeMinutes?: number;
  slotDurationMinutes?: number;
}

export interface StationResponse {
  id: number;
  stationName: string;
  address: string;
  city: string;
  district: string;
  latitude: number;
  longitude: number;
  contactNumber: string;
}

export interface AdminRegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  stationId: number;
}

export const stationAdminService = {
  /**
   * Create a fuel station and return its ID for admin registration.
   */
  createStation: (
    data: CreateStationRequest
  ): Promise<ApiResponse<StationResponse>> =>
    apiClient.post<StationResponse>("/stations", data),

  /**
   * Get a list of all active stations (used when station already exists).
   */
  getAllStations: (): Promise<ApiResponse<StationResponse[]>> =>
    apiClient.get<StationResponse[]>("/stations"),

  /**
   * Register an admin tied to a station.
   */
  adminRegister: (data: AdminRegisterPayload): Promise<ApiResponse<any>> =>
    apiClient.post("/auth/admin/register", data),

  /**
   * Admin login
   */
  adminLogin: (data: {
    email: string;
    password: string;
  }): Promise<ApiResponse<any>> =>
    apiClient.post("/auth/admin/login", data),
};

export default stationAdminService;
