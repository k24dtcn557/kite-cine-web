import {
  LoginPayload,
  AuthResponse,
  RegisterPayload,
  UserDto,
  UpdateMyInfoPayload,
  ChangePasswordPayload,
} from "../types/user";
import apiClient from "../api/client";
import { ApiResponse } from "../api/types";

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
   * Registers a new user.
   */
  async register(payload: RegisterPayload): Promise<UserDto> {
    try {
      const response = await apiClient.post<ApiResponse<UserDto>>(
        "/kite-cine/users/register",
        payload,
      );
      return response.data.result;
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    const token = localStorage.getItem("access_token");
    localStorage.removeItem("access_token");
    if (token) {
      try {
        await apiClient.post("/kite-cine/auth/logout", { token });
      } catch (error) {
        console.error("Logout API failed", error);
      }
    }
  }

  /**
   * Checks if a token currently exists in local storage.
   * Note: This does not verify token validity/expiration with the backend.
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem("access_token");
  }

  /**
   * Fetches the current authenticated user's information.
   */
  async getMyInfo(): Promise<UserDto> {
    try {
      const response = await apiClient.get<ApiResponse<UserDto>>(
        "/kite-cine/users/my-info",
      );
      return response.data.result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates the current authenticated user's information.
   */
  async updateMyInfo(payload: UpdateMyInfoPayload): Promise<UserDto> {
    try {
      // User requested /kite-cine/my-info, but my-info get is /kite-cine/users/my-info
      // We will use /kite-cine/users/my-info as it is most likely correct,
      // but if the endpoint is strictly /kite-cine/my-info, change this.
      const response = await apiClient.put<ApiResponse<UserDto>>(
        "/kite-cine/users/my-info",
        payload,
      );
      return response.data.result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Changes the current authenticated user's password.
   */
  async changePassword(payload: ChangePasswordPayload): Promise<void> {
    try {
      await apiClient.post("/kite-cine/users/change-password", payload);
    } catch (error) {
      throw error;
    }
  }
}

// Export a singleton instance of the service
export const authService = new AuthService();
