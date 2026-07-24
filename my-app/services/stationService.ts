import apiClient, { ApiResponse } from "./apiClient";

export interface FuelInventoryItem {
  fuelType: string;
  availableLiters: number;
  maxCapacityLiters: number;
  status: "AVAILABLE" | "LOW" | "OUT_OF_STOCK";
}

export interface StationSummaryResponse {
  id: number;
  name: string;
  address: string;
  city: string;
  district: string;
  latitude: number;
  longitude: number;
  distanceKm?: number;
  status: "OPEN" | "CLOSED" | "BUSY";
  availableFuelTypes: string[];
}

export interface StationDetailResponse extends StationSummaryResponse {
  phoneNumber?: string;
  operatingHours?: string;
  inventories: FuelInventoryItem[];
}

export interface CreateFuelStationRequest {
  name: string;
  address: string;
  city: string;
  district: string;
  latitude: number;
  longitude: number;
  phoneNumber?: string;
  operatingHours?: string;
}

export interface UpdateFuelStationRequest extends Partial<CreateFuelStationRequest> {
  status?: "OPEN" | "CLOSED" | "BUSY";
}

export interface UpdateFuelInventoryRequest {
  fuelType: string;
  availableLiters: number;
  maxCapacityLiters?: number;
}

export interface TimeSlotResponse {
  id: number;
  stationId: number;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  bookedCount: number;
  availableCapacity: number;
  status: "AVAILABLE" | "FULL" | "CLOSED";
}

export const stationService = {
  /**
   * Create a new fuel station (Admin)
   */
  createStation: (data: CreateFuelStationRequest): Promise<ApiResponse<StationDetailResponse>> =>
    apiClient.post<StationDetailResponse>("/stations", data),

  /**
   * Get all active fuel stations
   */
  getAllStations: (): Promise<ApiResponse<StationSummaryResponse[]>> =>
    apiClient.get<StationSummaryResponse[]>("/stations"),

  /**
   * Search fuel stations by city, district, or name
   */
  searchStations: (params: { city?: string; district?: string; name?: string }): Promise<ApiResponse<StationSummaryResponse[]>> =>
    apiClient.get<StationSummaryResponse[]>("/stations/search", params),

  /**
   * Get nearby stations by coordinates and optional radius (in km)
   */
  getNearbyStations: (lat: number, lon: number, radius: number = 10.0): Promise<ApiResponse<StationSummaryResponse[]>> =>
    apiClient.get<StationSummaryResponse[]>("/stations/nearby", { lat, lon, radius }),

  /**
   * Get fuel station details by ID
   */
  getStationDetail: (stationId: number, coordinates?: { lat?: number; lon?: number }): Promise<ApiResponse<StationDetailResponse>> =>
    apiClient.get<StationDetailResponse>(`/stations/${stationId}`, coordinates),

  /**
   * Update fuel station info (Admin)
   */
  updateStation: (stationId: number, data: UpdateFuelStationRequest): Promise<ApiResponse<StationDetailResponse>> =>
    apiClient.put<StationDetailResponse>(`/stations/${stationId}`, data),

  /**
   * Delete fuel station (Admin)
   */
  deleteStation: (stationId: number): Promise<ApiResponse<void>> =>
    apiClient.delete<void>(`/stations/${stationId}`),

  /**
   * Update fuel inventory for a station (Admin)
   */
  updateFuelInventory: (stationId: number, data: UpdateFuelInventoryRequest): Promise<ApiResponse<FuelInventoryItem>> =>
    apiClient.put<FuelInventoryItem>(`/stations/${stationId}/inventory`, data),

  /**
   * Get available booking time slots for a station on a specific date
   */
  getAvailableSlots: (stationId: number, date: string, fuelType: string): Promise<ApiResponse<TimeSlotResponse[]>> =>
    apiClient.get<TimeSlotResponse[]>(`/stations/${stationId}/slots`, { date, fuelType }),
};

export default stationService;
