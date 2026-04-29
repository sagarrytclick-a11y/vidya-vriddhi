/**
 * College Domain Types
 *
 * Centralized type definitions for College entity.
 * Extends and replaces types/college.ts
 */

import { CityLite } from './city'

/**
 * Related entities (minimal info)
 */
export interface CollegeCountry {
  id: string
  name: string
  slug: string
  flagEmoji?: string
}

export interface CollegeCity {
  id: string
  name: string
  slug: string
}

export interface CollegeCategory {
  id: string
  name: string
  slug: string
}

export interface CollegeCourse {
  id: string
  name: string
  slug: string
}

export interface CollegeExam {
  id: string
  name: string
  slug: string
  shortName?: string
}

/**
 * Base College interface
 */
export interface College {
  id: string
  name: string
  slug: string
  description: string | null
  active: boolean
  countryId: string
  cityId: string
  createdAt: string
  updatedAt: string
}

/**
 * College with full details (detail view)
 */
export interface CollegeDetail extends College {
  establishment_year: number | null
  Countryranking: number | null
  Internationalranking: number | null
  logoURL: string | null
  imageURL: string | null
  features: string[]
  bannerUrl?: string | null
  aboutContent?: string | null
  overview?: Record<string, unknown>
  keyHighlights?: Record<string, unknown>
  documentsRequired?: Record<string, unknown>
  feesStructure?: Record<string, unknown>
  admissionProcess?: Record<string, unknown>
  whyChooseUs?: Record<string, unknown>
  campusHighlights?: Record<string, unknown>
  ranking?: Record<string, unknown>
  galleryImages?: string[]
  displayOrder?: number
  city: CollegeCity
  country: CollegeCountry
  categories: CollegeCategory[]
  courses: CollegeCourse[]
  exams: CollegeExam[]
}

/**
 * College for list views (card display)
 */
export interface CollegeListItem extends College {
  establishment_year: number | null
  Countryranking: number | null
  Internationalranking: number | null
  logoURL: string | null
  imageURL: string | null
  city: CollegeCity
  country: CollegeCountry
  categories: CollegeCategory[]
  courses: CollegeCourse[]
  exams: CollegeExam[]
  _count: {
    categories: number
    courses: number
    exams: number
  }
}

/**
 * Simplified college for dropdowns/comparison
 */
export interface CollegeLite {
  id: string
  name: string
  slug: string
  logoURL: string | null
}

/**
 * College form data for creation/update
 */
export interface CollegeFormData {
  name: string
  slug: string
  description: string
  establishment_year?: number
  Countryranking?: number
  Internationalranking?: number
  active: boolean
  features: string[]
  logoURL: string
  imageURL: string
  overview?: Record<string, unknown>
  keyHighlights?: {
    title: string
    description: string
    features: string[]
  }
  documentsRequired?: {
    title: string
    description: string
    documents: string[]
  }
  feesStructure?: {
    title: string
    description: string
    courses: {
      course_name: string
      duration: string
      annual_tuition_fee: string
    }[]
  }
  admissionProcess?: {
    title: string
    description: string
    steps: string[]
  }
  whyChooseUs?: {
    title: string
    description: string
    features: {
      title: string
      description: string
    }[]
  }
  campusHighlights?: {
    title: string
    description: string
    highlights: string[]
  }
  countryId: string
  cityId: string
  categories?: string[]
  exams?: string[]
  courses?: string[]
}
