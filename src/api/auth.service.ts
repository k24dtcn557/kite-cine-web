import apiClient from "./client";
import { ApiResponse } from "./types";

export interface LoginPayload {
  username: string;
  password?: string;
}

export interface AuthResponse {
  token: string;
}

class AuthService {
  /**
   * Submits user credentials to the authentication endpoint.
   * If successful, it stores the returned JWT token in local storage.
   *
   * @param credentials Email and password payload
   * @returns AuthResponse containing the token and user info
   */
  async login(credentials: LoginPayload): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        "/kite-cine/auth/token",
        credentials,
      );
      const authData = response.data.result;

      console.log("authData", authData);

      // Store token upon successful login
      if (authData.token) {
        localStorage.setItem("access_token", authData.token);
      }

      return authData;
    } catch (error) {
      // In a real application, we might want to transform the Axios error
      // into a generic application error format before re-throwing.
      throw error;
    }
  }

  /**
   * Logs out the user by removing their token from local storage.
   */
  logout(): void {
    localStorage.removeItem("access_token");
  }

  /**
   * Checks if a token currently exists in local storage.
   * Note: This does not verify token validity/expiration with the backend.
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem("access_token");
  }
}

// Export a singleton instance of the service
export const authService = new AuthService();
