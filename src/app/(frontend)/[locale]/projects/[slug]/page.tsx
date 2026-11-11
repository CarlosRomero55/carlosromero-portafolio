import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Grafico } from '@/components/Grafico'
import { Pagina } from '@/components/Pagina'
import { Prosa } from '@/components/Prosa'
import type { Locale } from '@/i18n/routing'
import { getProyecto, getProyectos, getSlugAlterno, type ProyectoDetalle } from '@/lib/data/public'
import { metadatos } from '@/lib/metadatos'
import { otroLocale, ruta, rutaProyecto, type Alternas } from '@/lib/rutas'

type P = { params: Promise<{ locale: Locale; slug: string }> }

const SLUG = /^[a-z0-9-]{1,120}$/

async function cargar(locale: Locale, slug: string) {
  if (!SLUG.test(slug)) return null
  const proyecto = await getProyecto(locale, slug)
  if (!proyecto) return null
  const otro = otroLocale(locale)
  const slugOtro = await getSlugAlterno(proyecto.id, otro)
  const alternas: Alternas = {
    [locale]: rutaProyecto(locale, slug),
    [otro]: slugOtro ? rutaProyecto(otro, slugOtro) : null,
  }
  return { proyecto, alternas }
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, slug } = await params
  const datos = await cargar(locale, slug)
  if (!datos) return {}
  const { proyecto, alternas } = datos
  return metadatos({
    locale,
    titulo: proyecto.seoTitulo ?? proyecto.titulo,
    descripcion: proyecto.seoDescripcion ?? proyecto.resumen,
    alternas,
    propia: rutaProyecto(locale, slug),
  })
}

const SECCIONES: { clave: keyof ProyectoDetalle & ('problema' | 'datosLimpieza' | 'metodo' | 'resultado' | 'aprendizajes') }[] = [
  { clave: 'problema' },
  { clave: 'datosLimpieza' },
  { clave: 'metodo' },
  { clave: 'resultado' },
  { clave: 'aprendizajes' },
]

export default async function DetalleProyecto({ params }: P) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const datos = await cargar(locale, slug)
  if (!datos) notFound()
  const { proyecto: p, alternas } = datos
  const [t, todos] = await Promise.all([getTranslations({ locale, namespace: 'proyectos' }), getProyectos(locale)])
  const i = todos.findIndex((x) => x.id === p.id)
  const anterior = i > 0 ? todos[i - 1] : null
  const siguiente = i >= 0 && i < todos.length - 1 ? todos[i + 1] : null
  const fecha = (iso: string) =>
    iso ? new Date(iso).toLocaleDateString(locale === 'es' ? 'es-EC' : 'en-US', { dateStyle: 'long', timeZone: 'UTC' }) : ''

  return (
    <Pagina locale={locale} actual="/projects/[slug]" alternas={alternas}>
      <article>
        <header className="contenedor cabecera-pagina" data-section="cabecera">
          <a className="enlace-flecha volver" href={ruta(locale, '/projects')}>
            <span aria-hidden="true">←</span> {t('todos')}
          </a>
          <h1>{p.titulo}</h1>
          <div className="meta-proyecto">
            <span className="etiqueta">{t(`area.${p.area}`)}</span>
            {p.tecnologias.length > 0 && (
              <span>
                <span className="sr-only">{t('tecnologias')}: </span>
                {p.tecnologias.join(' · ')}
              </span>
            )}
            {p.repositorio && (
              <a href={p.repositorio} rel="noopener noreferrer" target="_blank">
                {t('repositorio')} <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </header>

        <div className="contenedor">
          <section className="pregunta" data-section="pregunta" aria-labelledby="h-pregunta">
            <h2 id="h-pregunta" className="sobretitulo" style={{ fontFamily: 'var(--font-body)' }}>
              {t('pregunta')}
            </h2>
            <p>{p.preguntaNegocio}</p>
          </section>

          <div style={{ marginTop: 'var(--space-5)' }}>
            {SECCIONES.map(({ clave }, n) => (
              <section className="bloque" key={clave} data-section={clave} aria-labelledby={`h-${clave}`}>
                <span className="bloque__num" aria-hidden="true">
                  {String(n + 1).padStart(2, '0')}
                </span>
                <div>
                  <h2 id={`h-${clave}`}>{t(clave)}</h2>
                  <Prosa data={p[clave] as ProyectoDetalle['problema']} />
                  {clave === 'datosLimpieza' && p.fuentes.length > 0 && (
                    <>
                      <h3 style={{ marginTop: 'var(--space-4)' }}>{t('fuentes')}</h3>
                      <ul className="fuentes">
                        {p.fuentes.map((f) => (
                          <li key={f.url}>
                            <a href={f.url} rel="noopener noreferrer" target="_blank">
                              {f.nombre}
                            </a>{' '}
                            — {t('consultado', { fecha: fecha(f.fechaConsulta) })}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  {clave === 'resultado' &&
                    p.graficos.map((g) => (
                      <Grafico key={g.archivo} archivo={g.archivo} titulo={g.titulo} locale={locale} />
                    ))}
                </div>
              </section>
            ))}

            {p.capturas.length > 0 && (
              <section className="bloque" data-section="capturas" aria-labelledby="h-capturas">
                <span className="bloque__num" aria-hidden="true">
                  {String(SECCIONES.length + 1).padStart(2, '0')}
                </span>
                <div>
                  <h2 id="h-capturas">{t('capturas')}</h2>
                  <div className="capturas">
                    {p.capturas.map((c) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={c.url} src={c.url} alt={c.alt} width={c.ancho ?? 1200} height={c.alto ?? 750} loading="lazy" />
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>

          <nav className="paginacion" aria-label={t('titulo')}>
            {anterior ? (
              <a className="enlace-flecha" href={rutaProyecto(locale, anterior.slug)}>
                <span aria-hidden="true">←</span> {t('anterior')}: {anterior.titulo}
              </a>
            ) : (
              <span />
            )}
            {siguiente && (
              <a className="enlace-flecha" href={rutaProyecto(locale, siguiente.slug)}>
                {t('siguiente')}: {siguiente.titulo} <span aria-hidden="true">→</span>
              </a>
            )}
          </nav>
        </div>
      </article>
    </Pagina>
  )
}
