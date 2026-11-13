import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Pagina } from '@/components/Pagina'
import type { Locale } from '@/i18n/routing'
import { getArticulos } from '@/lib/data/public'
import { metadatos } from '@/lib/metadatos'
import { alternasDe, ruta, rutaArticulo } from '@/lib/rutas'

type P = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'articulos' })
  return metadatos({
    locale,
    titulo: t('titulo'),
    descripcion: t('intro'),
    alternas: alternasDe('/articles'),
    propia: ruta(locale, '/articles'),
  })
}

export default async function Articulos({ params }: P) {
  const { locale } = await params
  setRequestLocale(locale)
  const [t, articulos] = await Promise.all([getTranslations({ locale, namespace: 'articulos' }), getArticulos(locale)])
  const fecha = (iso: string) =>
    new Date(iso).toLocaleDateString(locale === 'es' ? 'es-EC' : 'en-US', { dateStyle: 'long', timeZone: 'UTC' })

  return (
    <Pagina locale={locale} actual="/articles" alternas={alternasDe('/articles')}>
      <header className="contenedor cabecera-pagina" data-section="cabecera">
        <p className="sobretitulo">{t('eyebrow')}</p>
        <h1>{t('titulo')}</h1>
        <p className="lead">{t('intro')}</p>
      </header>
      <section className="contenedor" data-section="lista" style={{ paddingBottom: 'var(--space-6)' }}>
        {articulos.length === 0 ? (
          <p className="vacio">{t('vacio')}</p>
        ) : (
          <ul className="articulos">
            {articulos.map((a) => (
              <li key={a.id}>
                <article className="ac" data-articulo={a.slug}>
                  {a.portada && (
                    <div className="ac__imagen">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={a.portada.url} alt="" width={a.portada.ancho ?? 1600} height={a.portada.alto ?? 900} loading="lazy" />
                    </div>
                  )}
                  <div className="ac__cuerpo">
                    <time className="nota" dateTime={a.fecha}>
                      {fecha(a.fecha)}
                    </time>
                    <h2 className="ac__titulo">
                      <a href={rutaArticulo(locale, a.slug)}>{a.titulo}</a>
                    </h2>
                    <p className="ac__resumen">{a.resumen}</p>
                    {a.etiquetas.length > 0 && (
                      <ul className="chips">
                        {a.etiquetas.map((e) => (
                          <li className="chip" key={e}>
                            {e}
                          </li>
                        ))}
                      </ul>
                    )}
                    <span className="pc__ver" aria-hidden="true">
                      {t('leer')} →
                    </span>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>
    </Pagina>
  )
}
