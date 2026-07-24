export interface Movie {
  id: string;
  title: string;
  genre: string;
  rating: number;
  posterUrl: string;
  badges?: string[];
}

export interface ComingSoonMovie {
  id: string;
  title: string;
  releaseDate: string;
  imageUrl: string;
  description?: string;
  featured?: boolean;
}
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
