import apiClient from "../api/client";
import { ApiResponse, PageResponse } from "../types/api";
import { PurchaseDetailDto } from "../types/booking";
import { CreateUserPayload, SearchUserPayload, UserDto } from "../types/user";
import {
  SearchBookingPayload,
  QuickStatsDto,
  ChartColumnDto,
} from "../types/booking";

class ManagementService {
  /**
   * Search users for admin management.
   */
  async searchUsers(
    payload: SearchUserPayload,
  ): Promise<PageResponse<UserDto>> {
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

  async createUser(payload: CreateUserPayload): Promise<UserDto> {
    try {
      const response = await apiClient.post<ApiResponse<UserDto>>(
        `/kite-cine/management/users`,
        payload,
      );
      return response.data.result;
    } catch (error) {
      throw error;
    }
  }

  async getUser(id: string): Promise<UserDto> {
    try {
      const response = await apiClient.get<ApiResponse<UserDto>>(
        `/kite-cine/management/users/${id}`,
      );
      return response.data.result;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id: string, payload: any): Promise<UserDto> {
    try {
      const response = await apiClient.put<ApiResponse<UserDto>>(
        `/kite-cine/management/users/${id}`,
        payload,
      );
      return response.data.result;
    } catch (error) {
      throw error;
    }
  }

  async lockUser(id: string): Promise<void> {
    try {
      await apiClient.post(`/kite-cine/management/users/${id}/lock`);
    } catch (error) {
      throw error;
    }
  }

  async activateUser(id: string): Promise<void> {
    try {
      await apiClient.post(`/kite-cine/management/users/${id}/activate`);
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await apiClient.delete(`/kite-cine/management/users/${id}`);
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(id: string): Promise<void> {
    try {
      await apiClient.post(`/kite-cine/management/users/${id}/reset-password`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Search bookings/tickets for admin management.
   */
  async searchBookings(
    payload: SearchBookingPayload,
  ): Promise<PageResponse<PurchaseDetailDto>> {
    try {
      const response = await apiClient.post<
        ApiResponse<PageResponse<PurchaseDetailDto>>
      >("/kite-cine/management/bookings/search", payload);
      return response.data.result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cancel a booking by code.
   */
  async cancelBooking(code: string): Promise<void> {
    try {
      await apiClient.post(`/kite-cine/management/bookings/${code}/cancel`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get quick stats for dashboard.
   */
  async getQuickStats(): Promise<QuickStatsDto> {
    try {
      const response = await apiClient.get<ApiResponse<QuickStatsDto>>(
        `/kite-cine/management/report/quick-stats`,
      );
      return response.data.result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get revenue chart data.
   */
  async getRevenueReport(type: string): Promise<ChartColumnDto[]> {
    try {
      const response = await apiClient.post<ApiResponse<ChartColumnDto[]>>(
        `/kite-cine/management/report/revenue`,
        { type },
      );
      return response.data.result;
    } catch (error) {
      throw error;
    }
  }
}

export const managementService = new ManagementService();
