import apiClient from "../api/client";
import { ApiResponse } from "../types/api";
import { PurchaseDetailDto } from "../types/booking";
import { InitializeBookingRequest, PurchaseDto } from "../types/booking";

export const bookingService = {
  initializeBooking: async (
    request: InitializeBookingRequest,
  ): Promise<PurchaseDto> => {
    const { data } = await apiClient.post<ApiResponse<PurchaseDto>>(
      "/kite-cine/booking/initialize",
      request,
    );
    return data.result;
  },

  payBooking: async (code: string): Promise<PurchaseDto> => {
    const { data } = await apiClient.post<ApiResponse<PurchaseDto>>(
      `/kite-cine/booking/${code}/pay`,
    );
    return data.result;
  },

  getBooking: async (code: string): Promise<PurchaseDetailDto> => {
    const { data } = await apiClient.get<ApiResponse<PurchaseDetailDto>>(
      `/kite-cine/booking/${code}`,
    );
    return data.result;
  },

  getUpcomings: async (): Promise<PurchaseDetailDto[]> => {
    const { data } = await apiClient.get<ApiResponse<PurchaseDetailDto[]>>(
      "/kite-cine/booking/up-comings",
    );
    return data.result;
  },

  getPast: async (): Promise<PurchaseDetailDto[]> => {
    const { data } = await apiClient.get<ApiResponse<PurchaseDetailDto[]>>(
      "/kite-cine/booking/past",
    );
    return data.result;
  },
};
