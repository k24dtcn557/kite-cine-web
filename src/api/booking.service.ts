import apiClient from "./client";
import { ApiResponse } from "./types";
import { TicketDto } from "./ticket.service";

export interface InitializeBookingRequest {
  ticketIds: number[];
}

export interface PurchaseDto {
  code: string;
  grandTotal: number;
  expirationTime: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  tickets?: TicketDto[];
}

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
      `/kite-cine/booking/${code}/pay`
    );
    return data.result;
  },
};
