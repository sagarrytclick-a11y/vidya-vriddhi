export interface College {
  id: string
  name: string
  slug: string
  description?: string
  active: boolean
  countryId: string
  cityId: string
  createdAt: string
  updatedAt: string
  establishment_year?: number
  features: string[]
  imageURL?: string
  logoURL?: string
  Countryranking?: number
  Internationalranking?: number
  documentsRequired?: any
  feesStructure?: any
  galleryImages?: any
  admissionProcess?: any
  whyChooseUs?: any
  overview?: any
  keyHighlights?: any
  ranking?: any
  campusHighlights?: any
  bannerUrl?: string
  aboutContent?: string
  displayOrder?: number
  city?: {
    id: string
    name: string
    countryId: string
  }
  country?: {
    id: string
    name: string
  }
  categories?: Array<{
    id: string
    name: string
  }>
  courses?: Array<{
    id: string
    name: string
  }>
  exams?: Array<{
    id: string
    name: string
  }>
}

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
  overview?: any
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

export interface CollegeListItem extends College {
  city?: {
    id: string
    name: string
    countryId: string
  }
  country?: {
    id: string
    name: string
  }
}
