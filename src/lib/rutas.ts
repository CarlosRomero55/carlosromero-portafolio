import { getPathname } from '@/i18n/navigation'
import type { Locale, RutaInterna } from '@/i18n/routing'

export type Alternas = Partial<Record<Locale, string | null>>

export function ruta(locale: Locale, href: RutaInterna): string {
  return getPathname({ locale, href })
}

export function rutaProyecto(locale: Locale, slug: string): string {
  return getPathname({ locale, href: { pathname: '/projects/[slug]', params: { slug } } })
}

/** Rutas equivalentes en ambos idiomas para una página estática. */
export function alternasDe(href: RutaInterna): Alternas {
  return { es: ruta('es', href), en: ruta('en', href) }
}

export function urlAbsoluta(path: string): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
  return `${base}${path}`
}

export function otroLocale(l: Locale): Locale {
  return l === 'es' ? 'en' : 'es'
}

export function rutaArticulo(locale: Locale, slug: string): string {
  return getPathname({ locale, href: { pathname: '/articles/[slug]', params: { slug } } })
}
