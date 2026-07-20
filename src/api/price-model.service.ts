import apiClient from "./client";
import { PageResponse } from "./types";
import { SeatType } from "./cinema.service";

export const PRICE_MODEL_SEAT_TYPES: { type: SeatType; label: string }[] = [
  { type: "STANDARD", label: "Tiêu chuẩn" },
  { type: "VIP", label: "VIP" },
  { type: "COUPLE", label: "Ghế đôi" },
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

export const priceModelService = {
  createPriceModel: async (payload: CreatePriceModelPayload) => {
    const response = await apiClient.post(
      "/kite-cine/management/price-models",
      payload,
    );
    return response.data;
  },

  updatePriceModel: async (id: string, payload: CreatePriceModelPayload) => {
    const response = await apiClient.put(
      `/kite-cine/management/price-models/${id}`,
      payload,
    );
    return response.data;
  },

  deletePriceModel: async (id: string) => {
    const response = await apiClient.delete(
      `/kite-cine/management/price-models/${id}`
    );
    return response.data;
  },

  searchPriceModels: async (payload: SearchPriceModelPayload) => {
    const response = await apiClient.post<{
      result: PageResponse<PriceModelDto>;
    }>("/kite-cine/management/price-models/search", payload);
    return response.data.result;
  },
};
