import { db } from '@/lib/db'
import { unstable_cache } from 'next/cache'

export const getCollegeBySlug = async (slug: string) => {
  return unstable_cache(
    async () => {
      return db.college.findUnique({
        where: { slug },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          establishment_year: true,
          Countryranking: true,
          Internationalranking: true,
          active: true,
          features: true,
          logoURL: true,
          imageURL: true,
          keyHighlights: true,
          whyChooseUs: true,
          documentsRequired: true,
          feesStructure: true,
          admissionProcess: true,
          campusHighlights: true,
          countryId: true,
          cityId: true,
          createdAt: true,
          updatedAt: true,
          city: {
            select: { id: true, name: true, slug: true },
          },
          country: {
            select: { id: true, name: true, slug: true, flagEmoji: true },
          },
          categories: {
            select: { id: true, name: true, slug: true },
          },
          courses: {
            select: { id: true, name: true, slug: true },
          },
          // List badges only — never pull exam Json blobs on college pages
          exams: {
            select: { id: true, name: true, slug: true, shortName: true },
          },
        },
      })
    },
    ['college-detail', slug],
    { revalidate: 3600 }
  )()
}

export const getRelatedColleges = async (countryId: string, collegeId: string) => {
  return unstable_cache(
    async () => {
      return db.college.findMany({
        where: { countryId, id: { not: collegeId }, active: true },
        take: 5,
        select: {
          id: true,
          name: true,
          slug: true,
          logoURL: true,
          description: true,
          city: { select: { name: true } },
          categories: { select: { name: true, slug: true } },
          _count: { select: { courses: true } },
        },
      })
    },
    ['related-colleges', countryId, collegeId],
    { revalidate: 3600 }
  )()
}

const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-600', ring: 'ring-blue-200' },
  green: { bg: 'bg-green-100', text: 'text-green-600', ring: 'ring-green-200' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600', ring: 'ring-orange-200' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600', ring: 'ring-purple-200' },
  red: { bg: 'bg-red-100', text: 'text-red-600', ring: 'ring-red-200' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', ring: 'ring-yellow-200' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', ring: 'ring-indigo-200' },
  teal: { bg: 'bg-teal-100', text: 'text-teal-600', ring: 'ring-teal-200' },
  pink: { bg: 'bg-pink-100', text: 'text-pink-600', ring: 'ring-pink-200' },
  cyan: { bg: 'bg-cyan-100', text: 'text-cyan-600', ring: 'ring-cyan-200' },
  slate: { bg: 'bg-slate-100', text: 'text-slate-600', ring: 'ring-slate-200' },
  violet: { bg: 'bg-violet-100', text: 'text-violet-600', ring: 'ring-violet-200' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', ring: 'ring-emerald-200' },
  rose: { bg: 'bg-rose-100', text: 'text-rose-600', ring: 'ring-rose-200' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-600', ring: 'ring-amber-200' },
  lime: { bg: 'bg-lime-100', text: 'text-lime-600', ring: 'ring-lime-200' },
}

export function getColorClasses(color: string) {
  return colorMap[color] || colorMap.blue
}
