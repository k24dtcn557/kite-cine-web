import { ReserveSeatRequest, TicketDto } from "../types/booking";
import apiClient from "../api/client";
import { ApiResponse } from "../types/api";

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
