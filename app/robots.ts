import { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/checkout/',
          '/cart/',
          '/sign-in/',
          '/sign-up/',
          '/unauthorized/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}