import apiClient from "./client";
import { ApiResponse, PageResponse } from "./types";

export enum MovieStatus {
  DRAFT = "DRAFT",
  COMING_SOON = "COMING_SOON",
  NOW_SHOWING = "NOW_SHOWING",
  ARCHIVED = "ARCHIVED",
}

export const MOVIE_STATUS_LABELS: Record<MovieStatus, string> = {
  [MovieStatus.DRAFT]: "Bản nháp",
  [MovieStatus.COMING_SOON]: "Sắp ra mắt",
  [MovieStatus.NOW_SHOWING]: "Đang chiếu",
  [MovieStatus.ARCHIVED]: "Lưu trữ",
};

export const GENRE_LIST = [
  "Hành động",
  "Viễn tưởng",
  "Tình cảm",
  "Kinh dị",
  "Hài hước",
  "Phiêu lưu",
  "Tâm lý",
  "Hoạt hình",
  "Tội phạm",
  "Tài liệu",
];

export const GENRE_FILTERS: string[] = [
  "Tất Cả",
  "Hành Động",
  "Kinh Dị",
  "Hoạt hình",
  "Hài Hước",
];

export enum CrewRole {
  DIRECTOR = "DIRECTOR",
  ACTOR = "ACTOR",
  PRODUCER = "PRODUCER",
  WRITER = "WRITER",
}

export const CREW_ROLE_LABELS: Record<CrewRole, string> = {
  [CrewRole.DIRECTOR]: "Đạo diễn",
  [CrewRole.ACTOR]: "Diễn viên",
  [CrewRole.PRODUCER]: "Nhà sản xuất",
  [CrewRole.WRITER]: "Biên kịch",
};

export interface SearchMoviesPayload {
  page: number;
  size: number;
  status?: string;
  highlighted?: boolean;
}

export interface CreateCrewPersonPayload {
  name: string;
  avatar: string;
  bio: string;
  dob: string; // LocalDate yyyy-MM-dd
}

export interface CrewPersonDto {
  id: number;
  name: string;
  avatar: string;
  bio: string;
  dob: string;
}

export interface CrewMemberDto {
  id?: number;
  movieId?: number;
  crewPersonId: number;
  role: string;
  name?: string;
  avatar?: string;
}

export interface SearchCrewPersonsPayload {
  page: number;
  size: number;
  keyword?: string;
}

export interface CreateCrewMemberPayload {
  movieId: number;
  crewPersonId: number;
  role: string;
}

export interface CreateMoviePayload {
  title: string;
  tagline: string;
  description: string;
  genres: string[];
  runtime: number;
  poster: string;
  background: string;
  video: string;
  releaseDate: string;
  highlighted: boolean;
  status: string;
}

export type UpdateMoviePayload = CreateMoviePayload;

export interface MovieDto {
  id: number;
  title: string;
  tagline: string;
  description: string;
  genres: string[];
  runtime: number;
  poster: string;
  background: string;
  video: string;
  releaseDate: string;
  highlighted: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

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
      { params }
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
