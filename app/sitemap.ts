import { MetadataRoute } from 'next'
import { unstable_cache } from 'next/cache'
import { db } from '@/lib/db'
import { SITE_IDENTITY } from './(main)/site-identity'

const domain = `https://${SITE_IDENTITY.domain}`

const getSitemapEntries = unstable_cache(
  async () => {
    const now = new Date()
    const [colleges, exams, countries, cities, blogs, news, courses] = await Promise.all([
      db.college.findMany({ where: { active: true }, select: { slug: true, updatedAt: true } }),
      db.exam.findMany({ where: { active: true }, select: { slug: true, updatedAt: true, createdAt: true } }),
      db.country.findMany({ where: { active: true }, select: { slug: true, createdAt: true } }),
      db.city.findMany({ where: { active: true }, select: { slug: true, createdAt: true } }),
      db.blog.findMany({ where: { active: true }, select: { slug: true, updatedAt: true } }),
      db.news.findMany({ where: { active: true }, select: { slug: true, updatedAt: true } }),
      db.course.findMany({ where: { active: true }, select: { slug: true, updatedAt: true } }),
    ])

    const staticPages: MetadataRoute.Sitemap = [
      { url: `${domain}/`, lastModified: now, priority: 1.0, changeFrequency: 'weekly' },
      { url: `${domain}/about`, lastModified: now, priority: 0.7, changeFrequency: 'monthly' },
      { url: `${domain}/contact`, lastModified: now, priority: 0.6, changeFrequency: 'monthly' },
      { url: `${domain}/services`, lastModified: now, priority: 0.8, changeFrequency: 'monthly' },
      { url: `${domain}/privacy`, lastModified: now, priority: 0.3, changeFrequency: 'yearly' },
      { url: `${domain}/terms`, lastModified: now, priority: 0.3, changeFrequency: 'yearly' },
      { url: `${domain}/colleges`, lastModified: now, priority: 0.9, changeFrequency: 'daily' },
      { url: `${domain}/exams`, lastModified: now, priority: 0.9, changeFrequency: 'daily' },
      { url: `${domain}/countries`, lastModified: now, priority: 0.8, changeFrequency: 'weekly' },
      { url: `${domain}/cities`, lastModified: now, priority: 0.8, changeFrequency: 'weekly' },
      { url: `${domain}/courses`, lastModified: now, priority: 0.9, changeFrequency: 'daily' },
      { url: `${domain}/study-abroad`, lastModified: now, priority: 0.8, changeFrequency: 'weekly' },
      { url: `${domain}/blogs`, lastModified: now, priority: 0.8, changeFrequency: 'weekly' },
      { url: `${domain}/news`, lastModified: now, priority: 0.7, changeFrequency: 'daily' },
      { url: `${domain}/site-map`, lastModified: now, priority: 0.4, changeFrequency: 'weekly' },
      { url: `${domain}/career`, lastModified: now, priority: 0.5, changeFrequency: 'monthly' },
      { url: `${domain}/compare-colleges`, lastModified: now, priority: 0.7, changeFrequency: 'weekly' },
      { url: `${domain}/online-mba`, lastModified: now, priority: 0.8, changeFrequency: 'weekly' },
      { url: `${domain}/btech`, lastModified: now, priority: 0.8, changeFrequency: 'weekly' },
      { url: `${domain}/neet-rank-predictor`, lastModified: now, priority: 0.7, changeFrequency: 'monthly' },
      { url: `${domain}/mbbs-in-kyrgyzstan`, lastModified: now, priority: 0.9, changeFrequency: 'weekly' },
      { url: `${domain}/mbbs-in-russia`, lastModified: now, priority: 0.9, changeFrequency: 'weekly' },
      { url: `${domain}/mbbs-in-georgia`, lastModified: now, priority: 0.9, changeFrequency: 'weekly' },
    ]

    return [
      ...staticPages,
      ...colleges.map((c) => ({
        url: `${domain}/colleges/${c.slug}`,
        lastModified: c.updatedAt,
        priority: 0.8,
        changeFrequency: 'weekly' as const,
      })),
      ...exams.map((e) => ({
        url: `${domain}/exams/${e.slug}`,
        lastModified: e.updatedAt ?? e.createdAt,
        priority: 0.7,
        changeFrequency: 'weekly' as const,
      })),
      ...countries.map((c) => ({
        url: `${domain}/countries/${c.slug}`,
        lastModified: c.createdAt,
        priority: 0.6,
        changeFrequency: 'monthly' as const,
      })),
      ...cities.map((c) => ({
        url: `${domain}/cities/${c.slug}`,
        lastModified: c.createdAt,
        priority: 0.6,
        changeFrequency: 'monthly' as const,
      })),
      ...blogs.map((b) => ({
        url: `${domain}/blogs/${b.slug}`,
        lastModified: b.updatedAt,
        priority: 0.6,
        changeFrequency: 'monthly' as const,
      })),
      ...news.map((n) => ({
        url: `${domain}/news/${n.slug}`,
        lastModified: n.updatedAt,
        priority: 0.6,
        changeFrequency: 'weekly' as const,
      })),
      ...courses.map((c) => ({
        url: `${domain}/courses/${c.slug}`,
        lastModified: c.updatedAt,
        priority: 0.7,
        changeFrequency: 'weekly' as const,
      })),
    ]
  },
  ['xml-sitemap'],
  { revalidate: 3600 }
)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getSitemapEntries()
}
