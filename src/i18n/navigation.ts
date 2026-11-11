import { routing, type Locale, type RutaInterna } from './routing'

/**
 * Construye la URL pública de una ruta interna en un idioma (/about → /es/sobre-mi).
 * Se implementa aquí para no enviar al navegador el Link de next-intl: el sitio no lo necesita.
 */
export function getPathname({
  locale,
  href,
}: {
  locale: Locale
  href: RutaInterna | { pathname: RutaInterna; params: Record<string, string> }
}): string {
  const interna = typeof href === 'string' ? href : href.pathname
  const params = typeof href === 'string' ? {} : href.params
  const def = routing.pathnames[interna]
  let ruta: string = typeof def === 'string' ? def : def[locale]
  for (const [k, v] of Object.entries(params)) ruta = ruta.replace(`[${k}]`, encodeURIComponent(v))
  return ruta === '/' ? `/${locale}` : `/${locale}${ruta}`
}
