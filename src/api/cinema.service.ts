import apiClient from './client';
import { ApiResponse, PageResponse } from './types';

export interface CinemaDto {
  id: number;
  name: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  status: string;
}

export interface AuditoriumDto {
  id: number;
  name: string;
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
}

export const cinemaService = {
  search: async (payload: SearchCinemasPayload): Promise<PageResponse<CinemaDto>> => {
    const response = await apiClient.post<ApiResponse<PageResponse<CinemaDto>>>('/kite-cine/management/cinemas/search', payload);
    return response.data.result;
  },
  create: async (payload: CreateCinemaPayload): Promise<CinemaDto> => {
    const response = await apiClient.post<ApiResponse<CinemaDto>>('/kite-cine/management/cinemas', payload);
    return response.data.result;
  },
  searchAuditoriums: async (payload: SearchAuditoriumsPayload): Promise<PageResponse<AuditoriumDto>> => {
    const response = await apiClient.post<ApiResponse<PageResponse<AuditoriumDto>>>('/kite-cine/management/cinemas/auditoriums/search', payload);
    return response.data.result;
  },
  createAuditorium: async (payload: CreateAuditoriumPayload): Promise<AuditoriumDto> => {
    const response = await apiClient.post<ApiResponse<AuditoriumDto>>('/kite-cine/management/cinemas/auditoriums', payload);
    return response.data.result;
  }
};
