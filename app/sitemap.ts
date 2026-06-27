import { SITE_IDENTITY } from './(main)/site-identity'

export default function sitemap() {
  const baseUrl = `https://${SITE_IDENTITY.domain}`

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/exams`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/colleges`,
      lastModified: new Date(),
    },
  ]
}
