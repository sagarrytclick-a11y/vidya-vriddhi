import { useQuery } from '@tanstack/react-query'

interface FilterData {
  categories: { id: string; name: string; slug: string }[]
  courses: { id: string; name: string; slug: string }[]
  cities: { id: string; name: string; slug: string }[]
  exams: { id: string; name: string; slug: string }[]
}

const fetchFiltersData = async (): Promise<FilterData> => {
  const [categories, courses, cities, exams] = await Promise.all([
    fetch('/api/categories?limit=100').then(res => res.json()),
    fetch('/api/courses?limit=100').then(res => res.json()),
    fetch('/api/cities?limit=100').then(res => res.json()),
    fetch('/api/exams?limit=100').then(res => res.json())
  ])

  return {
    categories: categories.categories || categories,
    courses: courses.courses || courses,
    cities: cities.cities || cities,
    exams: exams.exams || exams
  }
}

export function useCollegesFilters() {
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['colleges-filters'],
    queryFn: fetchFiltersData,
    staleTime: 30 * 60 * 1000, // 30 minutes - filters don't change often
  })
  
  return {
    categories: data?.categories || [],
    courses: data?.courses || [],
    cities: data?.cities || [],
    exams: data?.exams || [],
    isLoading,
    error: error?.message || null,
  }
}
