import type { MetadataRoute } from 'next'
import { urlAbsoluta } from '@/lib/rutas'

export default function robots(): MetadataRoute.Robots {
  if (process.env.NEXT_PUBLIC_NOINDEX === 'true') return { rules: { userAgent: '*', disallow: '/' } }
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] },
    sitemap: urlAbsoluta('/sitemap.xml'),
  }
}
