import apiClient from "./client";
import { ApiResponse } from "./types";

export interface CreateShowTimePayload {
  date: string;
  startTime: string;
  movieId: number;
  auditoriumId: number;
  priceModelId: number;
}

export interface ShowTimeDto {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  movieId: number;
  movieTitle: string;
  auditoriumId: number;
  priceModelId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ShowTimeBriefDto {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
}

export interface AuditoriumShowtimesDto {
  id: number;
  name: string;
  type: string;
  showTimes: ShowTimeBriefDto[];
}

export interface CinemaShowtimesDto {
  id: number;
  name: string;
  address: string;
  auditoriums: AuditoriumShowtimesDto[];
}

export const showTimeService = {
  createShowTime: async (payload: CreateShowTimePayload) => {
    const response = await apiClient.post<ApiResponse<any>>(
      "/kite-cine/management/show-times",
      payload,
    );
    return response.data.result;
  },

  getShowTimesByAuditoriumAndDate: async (
    auditoriumId: number,
    date: string,
  ) => {
    const response = await apiClient.get<ApiResponse<ShowTimeDto[]>>(
      `/kite-cine/management/auditoriums/${auditoriumId}/show-times`,
      { params: { date } },
    );
    return response.data.result;
  },

  getShowTimesByMovieAndDate: async (movieId: number, date: string) => {
    const response = await apiClient.get<ApiResponse<CinemaShowtimesDto[]>>(
      `/kite-cine/management/show-times`,
      { params: { movieId, date } },
    );
    return response.data.result;
  },

  getPublicShowTimesByMovieAndDate: async (movieId: number, date: string) => {
    const response = await apiClient.get<ApiResponse<CinemaShowtimesDto[]>>(
      `/kite-cine/movies/${movieId}/show-times`,
      { params: { date } },
    );
    return response.data.result;
  },
};
