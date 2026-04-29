/**
 * Standardized API Response Types
 *
 * This file defines consistent API response structures across the application.
 * All list endpoints should return data in the ApiResponse<T> format.
 */

/**
 * Pagination metadata for list responses
 */
export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

/**
 * Standard API response structure for list endpoints
 * @template T The type of items in the data array
 */
export interface ApiResponse<T> {
  data: T[]
  pagination: Pagination
}

/**
 * Helper type for extracting the item type from an ApiResponse
 * Usage: ItemType<ApiResponse<City>> returns City
 */
export type ItemType<T> = T extends ApiResponse<infer U> ? U : never

/**
 * Generic API error response structure
 */
export interface ApiError {
  error: string
  message?: string
  details?: Record<string, string[]>
}

/**
 * Single item API response (for detail endpoints)
 * @template T The type of the item
 */
export interface ApiItemResponse<T> {
  data: T
}
