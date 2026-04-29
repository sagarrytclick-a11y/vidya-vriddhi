import { ApiResponse, ApiError } from '@/types/api'

// API Client configuration
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? window.location.origin : '')

// Default headers for all requests
const defaultHeaders = {
  'Content-Type': 'application/json',
}

/**
 * Custom API Error class with status code and response data
 */
export class ApiClientError extends Error {
  status: number
  data?: any

  constructor(message: string, status: number, data?: any) {
    super(message)
    this.name = 'ApiClientError'
    this.status = status
    this.data = data
  }
}

/**
 * Build full URL from path
 */
function buildUrl(path: string): string {
  // If path already starts with http, use it as is
  if (path.startsWith('http')) {
    return path
  }
  
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  
  // Combine base URL with path
  return `${BASE_URL}${normalizedPath}`
}

/**
 * Handle API response and errors
 */
async function handleResponse<T>(response: Response): Promise<T> {
  // Clone response to allow reading body multiple times if needed
  const clonedResponse = response.clone()
  
  let data: any
  
  try {
    // Try to parse as JSON
    data = await response.json()
  } catch {
    // If not JSON, try to get text
    const text = await clonedResponse.text()
    data = { error: text || 'Unknown error' }
  }

  // Handle non-OK responses
  if (!response.ok) {
    const message = data?.error || data?.message || `HTTP ${response.status}: ${response.statusText}`
    throw new ApiClientError(message, response.status, data)
  }

  return data as T
}

/**
 * Generic GET request
 */
export async function get<T>(path: string, options?: RequestInit): Promise<T> {
  const url = buildUrl(path)
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
    ...options,
  })

  return handleResponse<T>(response)
}

/**
 * Generic POST request
 */
export async function post<T>(path: string, body: any, options?: RequestInit): Promise<T> {
  const url = buildUrl(path)
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
    body: JSON.stringify(body),
    ...options,
  })

  return handleResponse<T>(response)
}

/**
 * Generic PUT request
 */
export async function put<T>(path: string, body: any, options?: RequestInit): Promise<T> {
  const url = buildUrl(path)
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
    body: JSON.stringify(body),
    ...options,
  })

  return handleResponse<T>(response)
}

/**
 * Generic PATCH request
 */
export async function patch<T>(path: string, body: any, options?: RequestInit): Promise<T> {
  const url = buildUrl(path)
  
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
    body: JSON.stringify(body),
    ...options,
  })

  return handleResponse<T>(response)
}

/**
 * Generic DELETE request
 */
export async function del<T>(path: string, options?: RequestInit): Promise<T> {
  const url = buildUrl(path)
  
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
    ...options,
  })

  return handleResponse<T>(response)
}

/**
 * API Client object with all methods
 */
export const apiClient = {
  get,
  post,
  put,
  patch,
  delete: del,
}

/**
 * Generic fetcher for React Query that supports ApiResponse<T>
 * This handles the standardized { data, pagination } structure
 */
export async function fetcher<T>(path: string): Promise<ApiResponse<T>> {
  return get<ApiResponse<T>>(path)
}

/**
 * Fetch with pagination params helper
 */
export async function fetchWithPagination<T>(
  path: string,
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<ApiResponse<T>> {
  const params = new URLSearchParams()
  params.append('page', page.toString())
  params.append('limit', limit.toString())
  if (search) params.append('search', search)
  
  const queryString = params.toString()
  const fullPath = `${path}${queryString ? `?${queryString}` : ''}`
  
  return get<ApiResponse<T>>(fullPath)
}

export default apiClient
