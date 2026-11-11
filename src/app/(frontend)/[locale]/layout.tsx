import '@fontsource/cormorant-garamond/500.css'
import '@fontsource/cormorant-garamond/500-italic.css'
import '@fontsource-variable/inter'
import '@/styles/global.css'
import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { ReactNode } from 'react'
import { routing, type Locale } from '@/i18n/routing'

export const viewport: Viewport = { themeColor: '#faf8f3', colorScheme: 'light' }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    title: { default: t('sitio'), template: `%s · Carlos Romero` },
    description: t('descripcion'),
    robots: process.env.NEXT_PUBLIC_NOINDEX === 'true' ? { index: false, follow: false } : undefined,
  }
}

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale as Locale)
  const t = await getTranslations({ locale, namespace: 'nav' })

  return (
    <html lang={locale}>
      <body>
        <a className="saltar" href="#contenido">
          {t('saltar')}
        </a>
        {children}
      </body>
    </html>
  )
}
