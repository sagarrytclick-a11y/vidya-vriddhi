import { useQuery } from '@tanstack/react-query'

interface Country {
  id: string
  name: string
  slug: string
  flagEmoji: string | null
  description: string | null
  active: boolean
  createdAt?: string
  updatedAt?: string
  _count: {
    colleges: number
    cities?: number
  }
}

interface CountriesResponse {
  success: boolean
  countries: Country[]
}

type UseCountriesOptions = {
  excludeIndia?: boolean
  active?: boolean
}

const fetchCountries = async (
  excludeIndia: boolean = true,
  active?: boolean
): Promise<Country[]> => {
  const params = new URLSearchParams({
    excludeIndia: String(excludeIndia),
  })
  if (active) params.set('active', 'true')

  const response = await fetch(`/api/countries?${params.toString()}`)

  if (!response.ok) {
    throw new Error('Failed to fetch countries')
  }

  const data: CountriesResponse = await response.json()
  return data.countries
}

/** Supports `useCountries(true)` or `useCountries({ excludeIndia, active })` */
export const useCountries = (excludeIndiaOrOptions: boolean | UseCountriesOptions = true) => {
  const options: UseCountriesOptions =
    typeof excludeIndiaOrOptions === 'boolean'
      ? { excludeIndia: excludeIndiaOrOptions }
      : excludeIndiaOrOptions

  const excludeIndia = options.excludeIndia ?? true
  const active = options.active

  return useQuery({
    queryKey: ['countries', excludeIndia, active ?? null],
    queryFn: () => fetchCountries(excludeIndia, active),
    staleTime: 5 * 60 * 1000,
  })
}
