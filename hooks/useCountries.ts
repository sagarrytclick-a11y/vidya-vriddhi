import { useQuery } from '@tanstack/react-query'

interface Country {
  id: string
  name: string
  slug: string
  flagEmoji: string | null
  description: string | null
  active: boolean
  createdAt: string
  updatedAt: string
  _count: {
    colleges: number
  }
}

interface CountriesResponse {
  success: boolean
  countries: Country[]
}

const fetchCountries = async (excludeIndia: boolean = true): Promise<Country[]> => {
  const response = await fetch(`/api/countries?excludeIndia=${excludeIndia}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch countries')
  }
  
  const data: CountriesResponse = await response.json()
  return data.countries
}

export const useCountries = (excludeIndia: boolean = true) => {
  return useQuery({
    queryKey: ['countries', excludeIndia],
    queryFn: () => fetchCountries(excludeIndia),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
