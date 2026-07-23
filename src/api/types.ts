import { AuditoriumDto } from "./cinema.service";
import { MovieDto } from "./movie.service";
import { TicketDto } from "./ticket.service";

/**
 * Generic interface representing the standard structure of all API responses.
 *
 * @template T The type of the data payload inside the result object.
 */
export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

export interface PageResponse<T> {
  data?: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

/**
 * Extracts the server-side error message from an AxiosError's ApiResponse body.
 * Falls back to a generic message if the structure is not as expected.
 */
export function getApiErrorMessage(
  error: unknown,
  fallback = "Đã xảy ra lỗi. Vui lòng thử lại.",
): string {
  if (error && typeof error === "object" && "response" in error) {
    const response = (error as { response?: { data?: ApiResponse<unknown> } })
      .response;
    const msg = response?.data?.message;
    if (msg && typeof msg === "string") return msg;
  }
  return fallback;
}

export enum BookingStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
}

export const BookingStatusText: Record<BookingStatus | string, string> = {
  [BookingStatus.PENDING]: "Đang xử lý",
  [BookingStatus.PAID]: "Đã thanh toán",
  [BookingStatus.CANCELLED]: "Đã hủy",
};

export interface PurchaseDetailDto {
  code: string;
  showtime: ShowTimeDetailDto;
  status?: BookingStatus;
  grandTotal?: number;
  tickets: TicketDto[];
}

export interface ShowTimeDetailDto {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  movie: MovieDto;
  auditorium: AuditoriumDto;
}
