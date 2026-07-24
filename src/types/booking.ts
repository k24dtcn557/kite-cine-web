import { ShowTimeDetailDto } from "./showtime";

export interface InitializeBookingRequest {
  ticketIds: number[];
}

export interface PurchaseDto {
  code: string;
  grandTotal: number;
  expirationTime: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  tickets?: TicketDto[];
}
export interface SearchBookingPayload {
  keyword?: string;
  status?: string;
  page?: number;
  size?: number;
}

export interface QuickStatsDto {
  revenue: number;
  totalCinemas: number;
  totalAuditoriums: number;
  totalSoldSeats: number;
  fillRate: number;
}

export interface ChartColumnDto {
  label: string;
  value: number;
}
export interface ReserveSeatRequest {
  showtimeId: number;
  seatId: number;
}

export interface TicketDto {
  id: number;
  showtimeId: number;
  seatId: number;
  rowLetter: string;
  seatNumber: string;
  seatType: string;
  purchasePrice: number;
  buyerId: string;
  expirationTime: string;
  qrCode: string;
  status: string;
  createdAt: string;
  updatedAt: string;
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
