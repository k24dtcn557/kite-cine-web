import apiClient from "./client";
import { ApiResponse, PageResponse } from "./types";
import { UserDto } from "./auth.service";

export interface SearchUserPayload {
  keyword?: string;
  role?: string;
  page?: number;
  size?: number;
}

class ManagementService {
  /**
   * Search users for admin management.
   */
  async searchUsers(payload: SearchUserPayload): Promise<PageResponse<UserDto>> {
    try {
      const response = await apiClient.post<ApiResponse<PageResponse<UserDto>>>(
        "/kite-cine/management/users/search",
        payload,
      );
      return response.data.result;
    } catch (error) {
      throw error;
    }
  }
}

export const managementService = new ManagementService();
