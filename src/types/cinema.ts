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
  cinema: CinemaDto;
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

export interface CinemaPayload {
  name: string;
  address: string;
}

export interface AuditoriumPayload {
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
