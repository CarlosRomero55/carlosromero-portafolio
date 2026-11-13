import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Pagina } from '@/components/Pagina'
import { Prosa } from '@/components/Prosa'
import { Ventana } from '@/components/Ventana'
import type { Locale } from '@/i18n/routing'
import { getArticulo, getSlugAlternoArticulo } from '@/lib/data/public'
import { metadatos } from '@/lib/metadatos'
import { otroLocale, ruta, rutaArticulo, rutaProyecto, type Alternas } from '@/lib/rutas'

type P = { params: Promise<{ locale: Locale; slug: string }> }
const SLUG = /^[a-z0-9-]{1,120}$/

async function cargar(locale: Locale, slug: string) {
  if (!SLUG.test(slug)) return null
  const articulo = await getArticulo(locale, slug)
  if (!articulo) return null
  const otro = otroLocale(locale)
  const slugOtro = await getSlugAlternoArticulo(articulo.id, otro)
  const alternas: Alternas = { [locale]: rutaArticulo(locale, slug), [otro]: slugOtro ? rutaArticulo(otro, slugOtro) : null }
  return { articulo, alternas }
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, slug } = await params
  const datos = await cargar(locale, slug)
  if (!datos) return {}
  const { articulo: a, alternas } = datos
  const base = metadatos({
    locale,
    titulo: a.seoTitulo ?? a.titulo,
    descripcion: a.seoDescripcion ?? a.resumen,
    alternas,
    propia: rutaArticulo(locale, slug),
  })
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: 'article',
      publishedTime: a.fecha,
      ...(a.portada ? { images: [{ url: a.portada.url, alt: a.portada.alt }] } : {}),
    },
  }
}

export default async function DetalleArticulo({ params }: P) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const datos = await cargar(locale, slug)
  if (!datos) notFound()
  const { articulo: a, alternas } = datos
  const t = await getTranslations({ locale, namespace: 'articulos' })
  const fecha = new Date(a.fecha).toLocaleDateString(locale === 'es' ? 'es-EC' : 'en-US', { dateStyle: 'long', timeZone: 'UTC' })

  return (
    <Pagina locale={locale} actual="/articles/[slug]" alternas={alternas}>
      <article>
        <header className="contenedor caso-cabecera" data-section="cabecera" style={{ maxWidth: '52rem' }}>
          <a className="nota" href={ruta(locale, '/articles')} style={{ textDecoration: 'none' }}>
            <span aria-hidden="true">←</span> {t('todos')}
          </a>
          <p className="sobretitulo" style={{ marginTop: 'var(--space-4)' }}>
            <time dateTime={a.fecha}>{t('publicado', { fecha })}</time>
          </p>
          <h1>{a.titulo}</h1>
          {a.resumen && <p className="lead">{a.resumen}</p>}
          {a.etiquetas.length > 0 && (
            <ul className="chips" style={{ marginTop: 'var(--space-3)' }}>
              {a.etiquetas.map((e) => (
                <li className="chip" key={e}>
                  {e}
                </li>
              ))}
            </ul>
          )}
        </header>
        <div className="contenedor" style={{ maxWidth: '52rem', paddingBottom: 'var(--space-6)' }}>
          {a.portada && (
            <div style={{ marginBottom: 'var(--space-5)' }}>
              <Ventana imagen={a.portada} titulo={a.titulo} prioridad />
            </div>
          )}
          <div data-section="contenido" className="articulo-cuerpo">
            <Prosa data={a.contenido} />
          </div>
          {a.proyecto && (
            <aside className="tarjeta-base" style={{ padding: 'var(--space-4)', marginTop: 'var(--space-5)' }} data-section="relacionado">
              <p className="sobretitulo">{t('relacionado')}</p>
              <a className="enlace-flecha" href={rutaProyecto(locale, a.proyecto.slug)}>
                {a.proyecto.titulo} · {t('verCaso')} <span aria-hidden="true">→</span>
              </a>
            </aside>
          )}
        </div>
      </article>
    </Pagina>
  )
}
