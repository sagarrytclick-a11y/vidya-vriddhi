import { MetadataRoute } from 'next'
import { db } from '@/lib/db'
import { SITE_IDENTITY } from './(main)/site-identity'

const domain = `https://${SITE_IDENTITY.domain}`

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [colleges, exams, countries, cities, blogs] = await Promise.all([
    db.college.findMany({ where: { active: true }, select: { slug: true, updatedAt: true } }),
    db.exam.findMany({ where: { active: true }, select: { slug: true, createdAt: true } }),
    db.country.findMany({ where: { active: true }, select: { slug: true, createdAt: true } }),
    db.city.findMany({ where: { active: true }, select: { slug: true, createdAt: true } }),
    db.blog.findMany({ where: { active: true }, select: { slug: true, updatedAt: true } }),
  ])

  const staticPages = [
    { url: `${domain}/`, priority: 1.0, changeFrequency: 'weekly' as const },
    { url: `${domain}/about`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${domain}/contact`, priority: 0.6, changeFrequency: 'monthly' as const },
    { url: `${domain}/services`, priority: 0.8, changeFrequency: 'monthly' as const },
    { url: `${domain}/privacy`, priority: 0.3, changeFrequency: 'yearly' as const },
    { url: `${domain}/terms`, priority: 0.3, changeFrequency: 'yearly' as const },
    { url: `${domain}/colleges`, priority: 0.9, changeFrequency: 'daily' as const },
    { url: `${domain}/exams`, priority: 0.9, changeFrequency: 'daily' as const },
    { url: `${domain}/countries`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${domain}/cities`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${domain}/courses`, priority: 0.9, changeFrequency: 'daily' as const },
    { url: `${domain}/study-abroad`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${domain}/blogs`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${domain}/news`, priority: 0.7, changeFrequency: 'daily' as const },
    { url: `${domain}/mbbs-in-kyrgyzstan`, priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${domain}/mbbs-in-russia`, priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${domain}/mbbs-in-georgia`, priority: 0.9, changeFrequency: 'weekly' as const },
  ]

  const collegePages = colleges.map((c) => ({
    url: `${domain}/colleges/${c.slug}`,
    lastModified: c.updatedAt,
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  }))

  const examPages = exams.map((e) => ({
    url: `${domain}/exams/${e.slug}`,
    lastModified: e.createdAt,
    priority: 0.7,
    changeFrequency: 'weekly' as const,
  }))

  const countryPages = countries.map((c) => ({
    url: `${domain}/countries/${c.slug}`,
    lastModified: c.createdAt,
    priority: 0.6,
    changeFrequency: 'monthly' as const,
  }))

  const cityPages = cities.map((c) => ({
    url: `${domain}/cities/${c.slug}`,
    lastModified: c.createdAt,
    priority: 0.6,
    changeFrequency: 'monthly' as const,
  }))

  const blogPages = blogs.map((b) => ({
    url: `${domain}/blogs/${b.slug}`,
    lastModified: b.updatedAt,
    priority: 0.6,
    changeFrequency: 'monthly' as const,
  }))

  return [
    ...staticPages,
    ...collegePages,
    ...examPages,
    ...countryPages,
    ...cityPages,
    ...blogPages,
  ]
}
