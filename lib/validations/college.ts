import { z } from 'zod'
import { rankingValueSchema } from '@/lib/ranking'

/** Coerce null/undefined → undefined for optional strings (DB/form often send null). */
const optionalString = z.preprocess(
  (v) => (v === null || v === undefined || v === '' ? undefined : v),
  z.string().optional()
)

/** Coerce null/undefined → '' for required nested text fields. */
const text = z.preprocess(
  (v) => (v === null || v === undefined ? '' : v),
  z.string()
)

const stringList = z.preprocess(
  (v) => (v == null ? [] : v),
  z.array(z.preprocess((item) => (item == null ? '' : item), z.string()))
)

const idList = z.preprocess((v) => {
  if (v == null) return undefined
  if (!Array.isArray(v)) return v
  return v
    .map((item) => (typeof item === 'string' ? item : item?.id))
    .filter((id): id is string => typeof id === 'string' && id.length > 0)
}, z.array(z.string()).optional())

const keyHighlightsSchema = z
  .object({
    title: text,
    description: text,
    features: stringList,
  })
  .optional()

const documentsRequiredSchema = z
  .object({
    title: text,
    description: text,
    documents: stringList,
  })
  .optional()

const feesStructureSchema = z
  .object({
    title: text,
    description: text,
    courses: z.preprocess(
      (v) => (v == null ? [] : v),
      z.array(
        z.object({
          course_name: text,
          duration: text,
          annual_tuition_fee: text,
        })
      )
    ),
  })
  .optional()

const admissionProcessSchema = z
  .object({
    title: text,
    description: text,
    steps: stringList,
  })
  .optional()

const whyChooseUsSchema = z
  .object({
    title: text,
    description: text,
    features: z.preprocess((v) => {
      if (v == null) return []
      if (!Array.isArray(v)) return v
      return v.map((item) => {
        if (typeof item === 'string') {
          return { title: item, description: '' }
        }
        return {
          title: item?.title ?? '',
          description: item?.description ?? '',
        }
      })
    }, z.array(z.object({ title: text, description: text }))),
  })
  .optional()

const campusHighlightsSchema = z
  .object({
    title: text,
    description: text,
    highlights: stringList,
  })
  .optional()

/**
 * Shared create/update body schema for /api/colleges.
 * Tolerant of nulls and incomplete nested CMS JSON from older records.
 */
export const collegeBodySchema = z.object({
  name: z.string().min(1, 'College name is required'),
  slug: z.string().min(1, 'College slug is required'),
  description: optionalString,
  active: z.boolean(),
  countryId: z.string().min(1, 'Country is required'),
  cityId: z.string().min(1, 'City is required'),
  establishment_year: z.preprocess((v) => {
    if (v === null || v === undefined || v === '') return undefined
    if (typeof v === 'string' && v.trim() !== '') {
      const n = Number.parseInt(v, 10)
      return Number.isFinite(n) ? n : v
    }
    return v
  }, z.number().optional()),
  Countryranking: rankingValueSchema,
  Internationalranking: rankingValueSchema,
  features: z.preprocess((v) => (v == null ? [] : v), z.array(z.string()).default([])),
  imageURL: optionalString,
  logoURL: optionalString,
  keyHighlights: z.preprocess((v) => (v == null ? undefined : v), keyHighlightsSchema),
  documentsRequired: z.preprocess((v) => (v == null ? undefined : v), documentsRequiredSchema),
  feesStructure: z.preprocess((v) => (v == null ? undefined : v), feesStructureSchema),
  admissionProcess: z.preprocess((v) => (v == null ? undefined : v), admissionProcessSchema),
  whyChooseUs: z.preprocess((v) => (v == null ? undefined : v), whyChooseUsSchema),
  campusHighlights: z.preprocess((v) => (v == null ? undefined : v), campusHighlightsSchema),
  categories: idList,
  exams: idList,
  courses: idList,
})

export type CollegeBody = z.infer<typeof collegeBodySchema>

export function formatZodIssues(issues: z.ZodIssue[]): string {
  return issues
    .map((issue) => {
      const path = issue.path.length ? issue.path.join('.') : 'body'
      return `${path}: ${issue.message}`
    })
    .join('; ')
}
