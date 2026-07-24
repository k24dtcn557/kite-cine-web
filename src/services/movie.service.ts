import {
  CreateMoviePayload,
  MovieDto,
  SearchMoviesPayload,
  UpdateMoviePayload,
  CreateCrewPersonPayload,
  CrewPersonDto,
  SearchCrewPersonsPayload,
  CreateCrewMemberPayload,
  CrewMemberDto,
} from "../types/movie";
import apiClient from "../api/client";
import { ApiResponse, PageResponse } from "../api/types";

export const movieService = {
  createMovie: async (payload: CreateMoviePayload): Promise<MovieDto> => {
    const response = await apiClient.post<ApiResponse<MovieDto>>(
      "/kite-cine/management/movies",
      payload,
    );
    return response.data.result;
  },
  searchMovies: async (
    payload: SearchMoviesPayload,
  ): Promise<PageResponse<MovieDto>> => {
    const response = await apiClient.post<ApiResponse<PageResponse<MovieDto>>>(
      "/kite-cine/management/movies/search",
      payload,
    );
    return response.data.result;
  },
  getMovieById: async (id: number): Promise<MovieDto> => {
    const response = await apiClient.get<ApiResponse<MovieDto>>(
      `/kite-cine/management/movies/${id}`,
    );
    return response.data.result;
  },
  viewMovieById: async (id: number): Promise<MovieDto> => {
    const response = await apiClient.get<ApiResponse<MovieDto>>(
      `/kite-cine/movies/${id}/detail`,
    );
    return response.data.result;
  },
  updateMovie: async (
    id: number,
    payload: UpdateMoviePayload,
  ): Promise<MovieDto> => {
    const response = await apiClient.put<ApiResponse<MovieDto>>(
      `/kite-cine/management/movies/${id}`,
      payload,
    );
    return response.data.result;
  },
  createCrewPerson: async (
    payload: CreateCrewPersonPayload,
  ): Promise<CrewPersonDto> => {
    const response = await apiClient.post<ApiResponse<CrewPersonDto>>(
      "/kite-cine/management/movies/crew-persons",
      payload,
    );
    return response.data.result;
  },
  searchCrewPersons: async (
    payload: SearchCrewPersonsPayload,
  ): Promise<PageResponse<CrewPersonDto>> => {
    const response = await apiClient.post<
      ApiResponse<PageResponse<CrewPersonDto>>
    >("/kite-cine/management/movies/crew-persons/search", payload);
    return response.data.result;
  },
  addCrewMember: async (payload: CreateCrewMemberPayload): Promise<void> => {
    await apiClient.post("/kite-cine/management/movies/crew-members", payload);
  },
  getMovieCrewMembers: async (movieId: number): Promise<CrewMemberDto[]> => {
    const response = await apiClient.get<ApiResponse<CrewMemberDto[]>>(
      `/kite-cine/management/movies/${movieId}/crew-members`,
    );
    return response.data.result;
  },
  viewMovieCrewMembers: async (movieId: number): Promise<CrewMemberDto[]> => {
    const response = await apiClient.get<ApiResponse<CrewMemberDto[]>>(
      `/kite-cine/movies/${movieId}/crew-members`,
    );
    return response.data.result;
  },
  deleteCrewMember: async (id: number): Promise<void> => {
    await apiClient.delete(`/kite-cine/management/movies/crew-members/${id}`);
  },
  deleteMovie: async (id: number): Promise<void> => {
    await apiClient.delete(`/kite-cine/management/movies/${id}`);
  },
  getHighlightedMovies: async (): Promise<MovieDto[]> => {
    const response = await apiClient.get<ApiResponse<MovieDto[]>>(
      "/kite-cine/movies/highlighted",
    );
    return response.data.result;
  },
  getNowShowingMovies: async (genre?: string): Promise<MovieDto[]> => {
    const params = genre ? { genre } : undefined;
    const response = await apiClient.get<ApiResponse<MovieDto[]>>(
      "/kite-cine/movies/now-showing",
      { params },
    );
    return response.data.result;
  },
  getComingSoonMovies: async (): Promise<MovieDto[]> => {
    const response = await apiClient.get<ApiResponse<MovieDto[]>>(
      "/kite-cine/movies/coming-soon",
    );
    return response.data.result;
  },
};
