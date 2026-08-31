import { MetadataRoute } from 'next'
import { SITE_IDENTITY } from './(main)/site-identity'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/admin-login',
        '/api/',
        '/sign-in/',
        '/sign-up/',
        '/profile/',
        '/dashboard/',
        '/saved/',
        '/applications/',
      ],
    },
    sitemap: `https://${SITE_IDENTITY.domain}/sitemap.xml`,
  }
}
