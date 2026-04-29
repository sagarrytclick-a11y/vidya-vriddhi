/**
 * Pagination Utilities
 *
 * Shared functions for handling pagination across API routes and client-side code.
 */

import { Pagination, ApiResponse } from '@/types/api'

/**
 * Maximum allowed items per page to prevent abuse
 */
export const MAX_PAGE_LIMIT = 100

/**
 * Default items per page when not specified
 */
export const DEFAULT_PAGE_LIMIT = 10

/**
 * Extracts and validates pagination parameters from URL search params
 *
 * @param searchParams - URLSearchParams from the request
 * @returns Object with validated page, limit, and calculated skip values
 *
 * @example
 * const { page, limit, skip } = createPaginationParams(url.searchParams)
 * // Use: db.model.findMany({ skip, take: limit })
 */
export function createPaginationParams(searchParams: URLSearchParams): {
  page: number
  limit: number
  skip: number
} {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const rawLimit = parseInt(searchParams.get('limit') || String(DEFAULT_PAGE_LIMIT), 10)
  const limit = Math.min(Math.max(1, rawLimit), MAX_PAGE_LIMIT)
  const skip = (page - 1) * limit

  return { page, limit, skip }
}

/**
 * Creates a standardized pagination response object
 *
 * @param data - Array of items for the current page
 * @param total - Total count of all items (before pagination)
 * @param page - Current page number
 * @param limit - Items per page
 * @returns ApiResponse with data and pagination metadata
 *
 * @example
 * const [items, total] = await Promise.all([
 *   db.model.findMany({ skip, take: limit }),
 *   db.model.count()
 * ])
 * return createPaginationResponse(items, total, page, limit)
 */
export function createPaginationResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): ApiResponse<T> {
  const totalPages = Math.ceil(total / limit)

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  }
}

/**
 * Creates pagination parameters for the client side (React hooks)
 *
 * @param page - Current page number (defaults to 1)
 * @param limit - Items per page (defaults to 10, max 100)
 * @returns Object with validated page, limit, and skip values
 */
export function createClientPaginationParams(
  page: number = 1,
  limit: number = DEFAULT_PAGE_LIMIT
): {
  page: number
  limit: number
  skip: number
} {
  const validatedPage = Math.max(1, page)
  const validatedLimit = Math.min(Math.max(1, limit), MAX_PAGE_LIMIT)
  const skip = (validatedPage - 1) * validatedLimit

  return {
    page: validatedPage,
    limit: validatedLimit,
    skip,
  }
}

/**
 * Calculates the total number of pages for a given total count and limit
 *
 * @param total - Total number of items
 * @param limit - Items per page
 * @returns Total number of pages
 */
export function calculateTotalPages(total: number, limit: number): number {
  return Math.ceil(total / Math.max(1, limit))
}
