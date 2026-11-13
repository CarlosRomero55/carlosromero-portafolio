import { getTranslations } from 'next-intl/server'
import type { Locale, RutaInterna } from '@/i18n/routing'
import { getArticulos } from '@/lib/data/public'
import { ruta, type Alternas } from '@/lib/rutas'

type Enlace = { href: RutaInterna; clave: 'sobreMi' | 'servicios' | 'proyectos' | 'articulos' | 'contacto' }
const ENLACES: Enlace[] = [
  { href: '/about', clave: 'sobreMi' },
  { href: '/services', clave: 'servicios' },
  { href: '/projects', clave: 'proyectos' },
  { href: '/articles', clave: 'articulos' },
  { href: '/contact', clave: 'contacto' },
]

type Props = { locale: Locale; actual: RutaInterna; alternas: Alternas }

export async function Encabezado({ locale, actual, alternas }: Props) {
  const t = await getTranslations({ locale, namespace: 'nav' })
  const tOtro = (l: Locale) => getTranslations({ locale: l, namespace: 'nav' })
  // "Artículos" aparece en el menú solo cuando hay al menos uno publicado en este idioma.
  const hayArticulos = (await getArticulos(locale)).length > 0
  const enlaces = ENLACES.filter((e) => e.href !== '/articles' || hayArticulos)

  const lista = (
    <ul className="nav__lista">
      {enlaces.map((e) => {
        const activo =
          actual === e.href ||
          (e.href === '/projects' && actual === '/projects/[slug]') ||
          (e.href === '/articles' && actual === '/articles/[slug]')
        return (
          <li key={e.href}>
            <a className="nav__enlace" href={ruta(locale, e.href)} aria-current={activo ? 'page' : undefined}>
              {t(e.clave)}
            </a>
          </li>
        )
      })}
    </ul>
  )

  const selector = await Promise.all(
    (['es', 'en'] as const).map(async (l) => {
      if (l === locale) {
        return (
          <span key={l} aria-current="true" lang={l}>
            <span aria-hidden="true">{l.toUpperCase()}</span>
            <span className="sr-only">{l === 'es' ? 'Español' : 'English'}</span>
          </span>
        )
      }
      const destino = alternas[l] ?? `${ruta(l, '/projects')}?aviso=sin-traduccion`
      const etiqueta = (await tOtro(l))('cambiarIdioma')
      return (
        <a key={l} href={destino} hrefLang={l} lang={l} aria-label={etiqueta}>
          {l.toUpperCase()}
        </a>
      )
    }),
  )

  return (
    <header className="encabezado">
      <div className="contenedor encabezado__fila">
        <a className="marca" href={ruta(locale, '/')}>
          Carlos Romero
        </a>
        <nav className="nav" aria-label={t('principal')}>
          {lista}
          <div className="idiomas" role="group" aria-label={t('idioma')}>
            {selector[0]}
            <span aria-hidden="true">·</span>
            {selector[1]}
          </div>
          <details className="menu-movil">
            <summary aria-label={t('menu')}>
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
                <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <span className="menu-movil__texto">{t('menu')}</span>
            </summary>
            {lista}
          </details>
        </nav>
      </div>
    </header>
  )
}
