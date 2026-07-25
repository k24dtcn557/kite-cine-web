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
