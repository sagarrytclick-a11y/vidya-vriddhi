/**
 * Domain Types Index
 *
 * Centralized export of all domain entities.
 * Import from here for consistency across the application.
 *
 * @example
 * import { City, CityWithStats, CreateCityData } from '@/types/domain'
 * import type { Course, CollegeListItem } from '@/types/domain'
 */

// City domain types
export type {
  City,
  CityWithCountry,
  CityWithStats,
  CityLite,
  CreateCityData,
  UpdateCityData,
} from './city'

// Course domain types
export type {
  Course,
  CourseCollege,
  CourseWithColleges,
  CourseWithStats,
  CourseLite,
  CreateCourseData,
  UpdateCourseData,
  CourseFormData,
} from './course'

// College domain types
export type {
  College,
  CollegeDetail,
  CollegeListItem,
  CollegeLite,
  CollegeFormData,
  CollegeCountry,
  CollegeCity,
  CollegeCategory,
  CollegeCourse,
  CollegeExam,
} from './college'
