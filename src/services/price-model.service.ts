import apiClient from "../api/client";
import { PageResponse } from "../types/api";
import {
  CreatePriceModelPayload,
  SearchPriceModelPayload,
  PriceModelDto,
} from "../types/showtime";

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
      `/kite-cine/management/price-models/${id}`,
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
