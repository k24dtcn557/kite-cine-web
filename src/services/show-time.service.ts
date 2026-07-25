import {
  CreateShowTimePayload,
  ShowTimeDto,
  CinemaShowtimesDto,
} from "../types/showtime";
import apiClient from "../api/client";
import { ApiResponse } from "../types/api";

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

  deleteShowTime: async (id: number) => {
    const response = await apiClient.delete<ApiResponse<any>>(
      `/kite-cine/management/show-times/${id}`,
    );
    return response.data;
  },
};
