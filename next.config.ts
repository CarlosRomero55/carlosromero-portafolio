import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** Cabeceras de seguridad para todas las rutas (la CSP la pone el proxy). */
const seguridad = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=(), browsing-topics=()',
  },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  serverExternalPackages: ['@react-pdf/renderer'],
  images: { localPatterns: [{ pathname: '/api/media/file/**' }] },
  async headers() {
    return [
      { source: '/:path*', headers: seguridad },
      // Archivos sin pasar por el proxy (cv.pdf, sitemap, robots): CSP estricta mínima.
      {
        source: '/:path*\\.(pdf|xml|txt)',
        headers: [{ key: 'Content-Security-Policy', value: "default-src 'none'; frame-ancestors 'none'" }],
      },
    ]
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
  turbopack: { root: path.resolve(dirname) },
}

export default withPayload(withNextIntl(nextConfig), { devBundleServerPackages: false })
