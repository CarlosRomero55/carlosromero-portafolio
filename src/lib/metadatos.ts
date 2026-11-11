import type { Metadata } from 'next'
import type { Locale } from '@/i18n/routing'
import { urlAbsoluta, type Alternas } from './rutas'

export function metadatos({
  locale,
  titulo,
  descripcion,
  alternas,
  propia,
}: {
  locale: Locale
  titulo: string
  descripcion: string
  alternas: Alternas
  propia: string
}): Metadata {
  const languages: Record<string, string> = {}
  for (const l of ['es', 'en'] as const) if (alternas[l]) languages[l] = urlAbsoluta(alternas[l]!)
  if (alternas.es) languages['x-default'] = urlAbsoluta(alternas.es)
  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: urlAbsoluta(propia), languages },
    openGraph: {
      title: titulo,
      description: descripcion,
      url: urlAbsoluta(propia),
      siteName: 'Carlos Romero',
      locale: locale === 'es' ? 'es_EC' : 'en_US',
      type: 'website',
    },
  }
}
