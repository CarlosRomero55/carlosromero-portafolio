import { defineRouting } from 'next-intl/routing'

export const LOCALES = ['es', 'en'] as const
export type Locale = (typeof LOCALES)[number]

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: 'es',
  localePrefix: 'always',
  // Sin cookies: la raíz decide por Accept-Language y, si no, español.
  localeCookie: false,
  pathnames: {
    '/': '/',
    '/about': { es: '/sobre-mi', en: '/about' },
    '/services': { es: '/servicios', en: '/services' },
    '/projects': { es: '/proyectos', en: '/projects' },
    '/projects/[slug]': { es: '/proyectos/[slug]', en: '/projects/[slug]' },
    '/contact': { es: '/contacto', en: '/contact' },
    '/privacy': { es: '/privacidad', en: '/privacy' },
  },
})

export type RutaInterna = keyof typeof routing.pathnames

export function esLocale(v: unknown): v is Locale {
  return typeof v === 'string' && (LOCALES as readonly string[]).includes(v)
}
