import apiClient from "../api/client";
import { ApiResponse } from "../types/api";
import { MediaUploadResponse } from "../types/media";

class MediaService {
  async uploadMedia(file: File): Promise<MediaUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<ApiResponse<MediaUploadResponse>>(
      "/kite-cine/media/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data.result;
  }
}

export const mediaService = new MediaService();
