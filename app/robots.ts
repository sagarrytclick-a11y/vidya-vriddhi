import { MetadataRoute } from 'next'
import { SITE_IDENTITY } from './(main)/site-identity'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/_next/', '/sign-in/', '/sign-up/'],
    },
    sitemap: `https://${SITE_IDENTITY.domain}/sitemap.xml`,
  }
}
