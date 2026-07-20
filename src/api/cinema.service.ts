import apiClient from "./client";
import { ApiResponse, PageResponse } from "./types";

export interface CinemaDto {
  id: number;
  name: string;
  address: string;
  numberOfAuditoriums: number;
  createdAt: string;
  updatedAt: string;
  status: string;
}

export type AuditoriumType =
  | "PREMIUM"
  | "GOLD_CLASS"
  | "LAMOUR"
  | "CINE_SUITE"
  | "FOURDX"
  | "IMAX";

export const AUDITORIUM_TYPE_LABELS: Record<AuditoriumType, string> = {
  PREMIUM: "PREMIUM",
  GOLD_CLASS: "GOLD CLASS",
  LAMOUR: "L'AMOUR",
  CINE_SUITE: "CINE SUITE",
  FOURDX: "4DX",
  IMAX: "IMAX",
};

export interface AuditoriumDto {
  id: number;
  name: string;
  type: AuditoriumType;
  createdAt: string;
  updatedAt: string;
  status: string;
}

export interface SearchCinemasPayload {
  page: number;
  size: number;
}

export interface SearchAuditoriumsPayload {
  cinemaId: number;
  page: number;
  size: number;
}

export interface CreateCinemaPayload {
  name: string;
  address: string;
}

export interface CreateAuditoriumPayload {
  name: string;
  cinemaId: number;
  type: AuditoriumType;
}

export type SeatType = "STANDARD" | "VIP" | "COUPLE";

export interface AddRowPayload {
  auditoriumId: number;
  rowLetter: string;
  numberOfSeats: number;
  seatType: SeatType;
}

export interface AddSeatPayload {
  auditoriumId: number;
  rowLetter: string;
  seatNumber: number;
  seatType: SeatType;
}

export interface SeatDto {
  id: number;
  rowLetter: string;
  seatNumber: number;
  seatType: string;
  auditoriumId: number;
}

export interface SeatRowDto {
  rowLetter: string;
  seats: SeatDto[];
}

export const cinemaService = {
  getCinemas: async (): Promise<CinemaDto[]> => {
    const response = await apiClient.get<ApiResponse<CinemaDto[]>>(
      "/kite-cine/management/cinemas",
    );
    return response.data.result;
  },
  create: async (payload: CreateCinemaPayload): Promise<CinemaDto> => {
    const response = await apiClient.post<ApiResponse<CinemaDto>>(
      "/kite-cine/management/cinemas",
      payload,
    );
    return response.data.result;
  },
  searchAuditoriums: async (
    payload: SearchAuditoriumsPayload,
  ): Promise<PageResponse<AuditoriumDto>> => {
    const response = await apiClient.post<
      ApiResponse<PageResponse<AuditoriumDto>>
    >("/kite-cine/management/cinemas/auditoriums/search", payload);
    return response.data.result;
  },
  createAuditorium: async (
    payload: CreateAuditoriumPayload,
  ): Promise<AuditoriumDto> => {
    const response = await apiClient.post<ApiResponse<AuditoriumDto>>(
      "/kite-cine/management/cinemas/auditoriums",
      payload,
    );
    return response.data.result;
  },
  getAuditoriumSeats: async (auditoriumId: number): Promise<SeatRowDto[]> => {
    const response = await apiClient.get<
      ApiResponse<SeatRowDto[]> | SeatRowDto[]
    >(`/kite-cine/management/cinemas/auditoriums/${auditoriumId}/seats`);
    const data = response.data;
    // Handle both cases: wrapped in ApiResponse or direct array
    return (data as ApiResponse<SeatRowDto[]>).result;
  },
  addRow: async (payload: AddRowPayload): Promise<any> => {
    const response = await apiClient.post<ApiResponse<any>>(
      "/kite-cine/management/cinemas/auditoriums/seats/add-row",
      payload,
    );
    return response.data.result;
  },
  addSeat: async (payload: AddSeatPayload): Promise<SeatDto> => {
    const response = await apiClient.post<ApiResponse<SeatDto>>(
      "/kite-cine/management/cinemas/auditoriums/seats",
      payload,
    );
    return response.data.result;
  },
  deleteSeats: async (payload: { ids: number[] }): Promise<void> => {
    await apiClient.post(
      "/kite-cine/management/cinemas/auditoriums/seats/delete",
      payload,
    );
  },
  changeSeatType: async (payload: {
    ids: number[];
    seatType: SeatType;
  }): Promise<void> => {
    await apiClient.post(
      "/kite-cine/management/cinemas/auditoriums/seats/change-type",
      payload,
    );
  },
};
