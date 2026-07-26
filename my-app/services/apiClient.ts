const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  timestamp?: string;
}

export interface RequestOptions extends RequestInit {
  token?: string;
  params?: Record<string, string | number | boolean | undefined | null>;
}

/**
 * Helper to build URL with query params
 */
function buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined | null>): string {
  const url = new URL(endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
}

/**
 * Base HTTP request factory.
 * @param tokenKey - which localStorage key to read the JWT from.
 *   "token"      → regular user (citizens booking fuel)
 *   "adminToken" → station admin (admin dashboard, queue, etc.)
 */
function makeRequest(tokenKey: "token" | "adminToken") {
  return async function request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const { token, params, headers: customHeaders, body, ...restOptions } = options;

    // Never send a stored token for auth routes unless explicitly passed
    const isAuthRoute = endpoint.includes("/auth/");
    const rawToken = typeof window !== "undefined" ? localStorage.getItem(tokenKey) : null;
    const authToken = token || (!isAuthRoute && rawToken ? rawToken : null);

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...customHeaders,
    };

    const fullUrl = buildUrl(endpoint, params);

    try {
      const response = await fetch(fullUrl, {
        headers,
        body: body ? (typeof body === "string" ? body : JSON.stringify(body)) : undefined,
        ...restOptions,
      });

      const text = await response.text();
      let data: any = {};
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = { message: text };
        }
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data as ApiResponse<T>;
    } catch (error: any) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  };
}

// ── USER API CLIENT ────────────────────────────────────────────────────────────
// Uses "token" from localStorage — for citizen-facing features:
//   bookings, profile, station list, timeslots, etc.
const userRequest = makeRequest("token");

export const apiClient = {
  get: <T = any>(endpoint: string, params?: Record<string, any>, options?: RequestOptions) =>
    userRequest<T>(endpoint, { ...options, method: "GET", params }),

  post: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    userRequest<T>(endpoint, { ...options, method: "POST", body }),

  put: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    userRequest<T>(endpoint, { ...options, method: "PUT", body }),

  patch: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    userRequest<T>(endpoint, { ...options, method: "PATCH", body }),

  delete: <T = any>(endpoint: string, options?: RequestOptions) =>
    userRequest<T>(endpoint, { ...options, method: "DELETE" }),
};

// ── ADMIN API CLIENT ───────────────────────────────────────────────────────────
// Uses "adminToken" from localStorage — for station-admin features:
//   admin dashboard, queue management, fuel inventory, admin slots, etc.
const adminRequest = makeRequest("adminToken");

export const adminApiClient = {
  get: <T = any>(endpoint: string, params?: Record<string, any>, options?: RequestOptions) =>
    adminRequest<T>(endpoint, { ...options, method: "GET", params }),

  post: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    adminRequest<T>(endpoint, { ...options, method: "POST", body }),

  put: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    adminRequest<T>(endpoint, { ...options, method: "PUT", body }),

  patch: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    adminRequest<T>(endpoint, { ...options, method: "PATCH", body }),

  delete: <T = any>(endpoint: string, options?: RequestOptions) =>
    adminRequest<T>(endpoint, { ...options, method: "DELETE" }),
};

export default apiClient;
