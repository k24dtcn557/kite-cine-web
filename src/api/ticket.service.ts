import apiClient from "./client";
import { ApiResponse } from "./types";

export interface ReserveSeatRequest {
  showtimeId: number;
  seatId: number;
}

export interface TicketDto {
  id: number;
  showtimeId: number;
  seatId: number;
  rowLetter: string;
  seatNumber: string;
  seatType: string;
  purchasePrice: number;
  buyerId: string;
  expirationTime: string;
  qrCode: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const ticketService = {
  reserveSeat: async (data: ReserveSeatRequest): Promise<TicketDto> => {
    const response = await apiClient.post<ApiResponse<TicketDto>>(
      "/kite-cine/tickets/reserve",
      data,
    );
    return response.data.result;
  },
  getMyHoldings: async (showtimeId: number): Promise<TicketDto[]> => {
    const response = await apiClient.get<ApiResponse<TicketDto[]>>(
      `/kite-cine/tickets/showtime/${showtimeId}/my-holdings`,
    );
    return response.data.result;
  },
  unreserveTicket: async (ticketId: number): Promise<void> => {
    await apiClient.delete(`/kite-cine/tickets/${ticketId}`);
  },
  getBookedTickets: async (showtimeId: number): Promise<TicketDto[]> => {
    const response = await apiClient.get<ApiResponse<TicketDto[]>>(
      `/kite-cine/tickets/showtime/${showtimeId}`,
    );
    return response.data.result;
  },
};
