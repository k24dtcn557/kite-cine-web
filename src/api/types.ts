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
