/**
 * Course Domain Types
 *
 * Centralized type definitions for Course entity.
 * Used across hooks, contexts, components, and API routes.
 */

/**
 * Related college information (minimal)
 */
export interface CourseCollege {
  id: string
  name: string
}

/**
 * Base Course interface
 */
export interface Course {
  id: string
  name: string
  slug: string
  description: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Course with related colleges
 */
export interface CourseWithColleges extends Course {
  colleges: CourseCollege[]
}

/**
 * Course with count aggregates
 */
export interface CourseWithStats extends Course {
  colleges: CourseCollege[]
  _count: {
    colleges: number
  }
}

/**
 * Simplified course for dropdowns/filters
 */
export interface CourseLite {
  id: string
  name: string
  slug: string
}

/**
 * Data required to create a new course
 */
export interface CreateCourseData {
  name: string
  slug: string
  description?: string
  active?: boolean
}

/**
 * Data for updating an existing course (all fields optional)
 */
export interface UpdateCourseData {
  name?: string
  slug?: string
  description?: string
  active?: boolean
}

/**
 * Course form data (used in admin forms)
 */
export interface CourseFormData {
  name: string
  slug: string
  description?: string
  active?: boolean
}
