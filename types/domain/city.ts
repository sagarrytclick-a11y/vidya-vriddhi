/**
 * City Domain Types
 *
 * Centralized type definitions for City entity.
 * Used across hooks, contexts, components, and API routes.
 */

/**
 * Base City interface - minimal fields required for display
 */
export interface City {
  id: string
  name: string
  slug: string
  description: string | null
  cityImageURL: string | null
  features: string[]
  active: boolean
  countryId: string
  createdAt: string
  updatedAt: string
}

/**
 * City with country information (common in list views)
 */
export interface CityWithCountry extends City {
  country: {
    id: string
    name: string
    slug: string
    flagEmoji: string | null
  }
}

/**
 * City with count aggregates (for display cards)
 */
export interface CityWithStats extends CityWithCountry {
  _count: {
    colleges: number
  }
}

/**
 * Simplified city for dropdowns/autocomplete
 */
export interface CityLite {
  id: string
  name: string
  slug: string
}

/**
 * Data required to create a new city
 */
export interface CreateCityData {
  name: string
  slug: string
  description?: string
  cityImageURL?: string
  features?: string[]
  active?: boolean
  countryId: string
}

/**
 * Data for updating an existing city (all fields optional)
 */
export interface UpdateCityData {
  name?: string
  slug?: string
  description?: string
  cityImageURL?: string
  features?: string[]
  active?: boolean
  countryId?: string
}
