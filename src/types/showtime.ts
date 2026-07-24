import { AuditoriumDto, SeatType } from "./cinema";
import { MovieDto } from "./movie";

export const PRICE_MODEL_SEAT_TYPES: { type: SeatType; label: string }[] = [
  { type: "STANDARD", label: "TIÊU CHUẨN" },
  { type: "VIP", label: "VIP" },
  { type: "COUPLE", label: "GHẾ ĐÔI" },
];

export interface PriceModelDto {
  id: string;
  name: string;
  prices: Record<string, number>;
}

export interface CreatePriceModelPayload {
  name: string;
  prices: Record<string, number>;
}

export interface SearchPriceModelPayload {
  keyword?: string;
  page?: number;
  size?: number;
}
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
export interface ShowTimeDetailDto {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  movie: MovieDto;
  auditorium: AuditoriumDto;
}
