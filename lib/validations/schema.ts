import { z } from 'zod'
import { rankingValueSchema } from '@/lib/ranking'

/**
 * Centralized Zod Validation Schemas
 * Used for both client-side and server-side validation
 */

// ============================================
// Common/Base Schemas
// ============================================

export const slugSchema = z
  .string()
  .min(1, 'Slug is required')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens')

export const nameSchema = z.string().min(1, 'Name is required').max(200, 'Name too long')

export const descriptionSchema = z.string().max(5000, 'Description too long').optional()

export const contentSchema = z.string().min(1, 'Content is required')

export const idSchema = z.string().cuid('Invalid ID format')

export const booleanSchema = z.boolean().default(false)

export const urlSchema = z.string().url().optional().or(z.literal(''))

// ============================================
// Course Schemas
// ============================================

export const courseCreateSchema = z.object({
  name: nameSchema,
  slug: slugSchema,
  description: descriptionSchema,
  active: booleanSchema,
})

export const courseUpdateSchema = courseCreateSchema.partial().extend({
  id: idSchema,
})

// ============================================
// Exam Schemas
// ============================================

export const examTypeSchema = z.enum(['NATIONAL', 'STATE', 'UNIVERSITY', 'INTERNATIONAL'])

export const examModeSchema = z.enum(['ONLINE', 'OFFLINE', 'HYBRID'])

export const frequencySchema = z.enum(['ONCE_A_YEAR', 'TWICE_A_YEAR', 'QUARTERLY', 'MONTHLY'])

export const examCreateSchema = z.object({
  name: nameSchema,
  slug: slugSchema,
  shortName: z.string().min(1, 'Short name is required').max(50, 'Short name too long'),
  description: contentSchema,
  active: booleanSchema,
  conductingBody: z.string().min(1, 'Conducting body is required'),
  frequency: frequencySchema,
  examMode: examModeSchema,
  examType: examTypeSchema,
  examImageurl: urlSchema,
  examPattern: z.record(z.string(), z.any()).optional(),
  examDates: z.record(z.string(), z.any()).optional(),
  overview: z.record(z.string(), z.any()).optional(),
  registration: z.record(z.string(), z.any()).optional(),
  resultStatistics: z.record(z.string(), z.any()).optional(),
})

export const examUpdateSchema = examCreateSchema.partial().extend({
  id: idSchema,
})

// ============================================
// Category Schemas
// ============================================

export const categoryCreateSchema = z.object({
  name: nameSchema,
  slug: slugSchema,
  description: descriptionSchema,
  active: booleanSchema,
  categoryImageUrl: urlSchema,
})

export const categoryUpdateSchema = categoryCreateSchema.partial().extend({
  id: idSchema,
})

// ============================================
// City Schemas
// ============================================

export const cityCreateSchema = z.object({
  name: nameSchema,
  slug: slugSchema,
  description: descriptionSchema,
  cityImageURL: urlSchema,
  features: z.array(z.string()).default([]),
  active: booleanSchema,
  countryId: idSchema,
})

export const cityUpdateSchema = cityCreateSchema.partial().extend({
  id: idSchema,
})

// ============================================
// Country Schemas
// ============================================

export const countryCreateSchema = z.object({
  name: nameSchema,
  slug: slugSchema,
  flagEmoji: z.string().optional(),
  description: descriptionSchema,
  active: booleanSchema,
})

export const countryUpdateSchema = countryCreateSchema.partial().extend({
  id: idSchema,
})

// ============================================
// News Schemas
// ============================================

export const newsCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(300, 'Title too long'),
  slug: slugSchema,
  content: contentSchema,
  active: booleanSchema,
  imageUrl: urlSchema,
})

export const newsUpdateSchema = newsCreateSchema.partial().extend({
  id: idSchema,
})

// ============================================
// Blog Schemas
// ============================================

export const blogCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(300, 'Title too long'),
  slug: slugSchema,
  content: contentSchema,
  active: booleanSchema,
  imageUrl: urlSchema,
})

export const blogUpdateSchema = blogCreateSchema.partial().extend({
  id: idSchema,
})

// ============================================
// College Schemas
// ============================================

export const collegeCreateSchema = z.object({
  name: nameSchema,
  slug: slugSchema,
  description: descriptionSchema,
  establishment_year: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
  Countryranking: rankingValueSchema,
  Internationalranking: rankingValueSchema,
  active: booleanSchema,
  features: z.array(z.string()).default([]),
  logoURL: urlSchema,
  imageURL: urlSchema,
  keyHighlights: z.record(z.string(), z.any()).optional(),
  whyChooseUs: z.record(z.string(), z.any()).optional(),
  documentsRequired: z.record(z.string(), z.any()).optional(),
  feesStructure: z.record(z.string(), z.any()).optional(),
  admissionProcess: z.record(z.string(), z.any()).optional(),
  campusHighlights: z.record(z.string(), z.any()).optional(),
  countryId: idSchema,
  cityId: idSchema,
  categoryIds: z.array(idSchema).optional(),
  courseIds: z.array(idSchema).optional(),
  examIds: z.array(idSchema).optional(),
})

export const collegeUpdateSchema = collegeCreateSchema.partial().extend({
  id: idSchema,
})

// ============================================
// Enquiry Schemas
// ============================================

export const enquiryStatusSchema = z.enum(['PENDING', 'RESOLVED', 'FOLLOW_UP'])

export const enquiryCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  city: z.string().optional(),
  category: z.string().optional(),
  status: enquiryStatusSchema.default('PENDING'),
})

export const enquiryUpdateSchema = z.object({
  id: idSchema,
  status: enquiryStatusSchema.optional(),
})

// ============================================
// Pagination & Query Schemas
// ============================================

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// ============================================
// Type Exports
// ============================================

export type CourseCreateInput = z.infer<typeof courseCreateSchema>
export type CourseUpdateInput = z.infer<typeof courseUpdateSchema>
export type ExamCreateInput = z.infer<typeof examCreateSchema>
export type ExamUpdateInput = z.infer<typeof examUpdateSchema>
export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>
export type CityCreateInput = z.infer<typeof cityCreateSchema>
export type CityUpdateInput = z.infer<typeof cityUpdateSchema>
export type CountryCreateInput = z.infer<typeof countryCreateSchema>
export type CountryUpdateInput = z.infer<typeof countryUpdateSchema>
export type NewsCreateInput = z.infer<typeof newsCreateSchema>
export type NewsUpdateInput = z.infer<typeof newsUpdateSchema>
export type BlogCreateInput = z.infer<typeof blogCreateSchema>
export type BlogUpdateInput = z.infer<typeof blogUpdateSchema>
export type CollegeCreateInput = z.infer<typeof collegeCreateSchema>
export type CollegeUpdateInput = z.infer<typeof collegeUpdateSchema>
export type EnquiryCreateInput = z.infer<typeof enquiryCreateSchema>
export type EnquiryUpdateInput = z.infer<typeof enquiryUpdateSchema>
export type PaginationQuery = z.infer<typeof paginationQuerySchema>
