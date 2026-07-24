import apiClient, { ApiResponse } from "./apiClient";

export interface LoginRequest {
  email?: string;
  phone?: string;
  password?: string;
}

export interface RegisterRequest {
  fullName?: string;
  name?: string;
  email: string;
  phone: string;
  nic: string;
  password?: string;
  confirmPassword?: string;
  vehicleNumber?: string;
  vehicleType?: string;
  fuelType?: string;
}

export interface AdminRegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  stationId?: number;
  role?: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface AuthResponse {
  accessToken?: string;
  token?: string;
  refreshToken?: string;
  userId?: number;
  email?: string;
  fullName?: string;
  name?: string;
  phone?: string;
  vehicleNumber?: string;
  role?: string;
}

export const authService = {
  /**
   * Login citizen user
   */
  userLogin: (data: LoginRequest): Promise<ApiResponse<AuthResponse>> =>
    apiClient.post<AuthResponse>("/auth/user/login", data),

  /**
   * Register citizen user
   */
  userRegister: (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> =>
    apiClient.post<AuthResponse>("/auth/user/register", data),

  /**
   * Login station admin / operator
   */
  adminLogin: (data: LoginRequest): Promise<ApiResponse<AuthResponse>> =>
    apiClient.post<AuthResponse>("/auth/admin/login", data),

  /**
   * Register station admin / operator
   */
  adminRegister: (data: AdminRegisterRequest): Promise<ApiResponse<AuthResponse>> =>
    apiClient.post<AuthResponse>("/auth/admin/register", data),

  /**
   * Reset password with token
   */
  resetPassword: (data: ResetPasswordRequest): Promise<ApiResponse<any>> =>
    apiClient.post("/auth/reset-password", data),

  /**
   * Request password reset email
   */
  forgotPassword: (data: ForgotPasswordRequest): Promise<ApiResponse<any>> =>
    apiClient.post("/auth/forgot-password", data),

  /**
   * Verify email address using token
   */
  verifyEmail: (token: string): Promise<ApiResponse<any>> =>
    apiClient.get("/auth/verify-email", { token }),
};

export default authService;
