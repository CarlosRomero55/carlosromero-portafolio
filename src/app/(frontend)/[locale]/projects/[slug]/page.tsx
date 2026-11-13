import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Grafico } from '@/components/Grafico'
import { Pagina } from '@/components/Pagina'
import { Prosa } from '@/components/Prosa'
import SimuladorChina from '@/components/SimuladorChina'
import { Ventana } from '@/components/Ventana'
import type { Locale } from '@/i18n/routing'
import { getProyecto, getProyectos, getSlugAlterno, type RichText } from '@/lib/data/public'
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
  const { proyecto: p, alternas } = datos
  const base = metadatos({
    locale,
    titulo: p.seoTitulo ?? p.titulo,
    descripcion: p.seoDescripcion ?? p.titular ?? p.resumen,
    alternas,
    propia: rutaProyecto(locale, slug),
  })
  // Vista previa al compartir en LinkedIn o WhatsApp: la imagen principal del caso.
  const imagen = p.portada ?? p.capturas[0] ?? null
  return imagen ? { ...base, openGraph: { ...base.openGraph, images: [{ url: imagen.url, alt: imagen.alt }] } } : base
}

const tieneTexto = (r: RichText) => Boolean(r && /"text":"[^"]*\S/.test(JSON.stringify(r)))

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

  const principal = p.portada ?? p.capturas[0] ?? null
  const tituloPrincipal = p.portada ? p.titulo : (p.capturas[0]?.titulo ?? p.titulo)
  const capturas = p.portada ? p.capturas : p.capturas.slice(1)

  // Secciones en orden; se numeran solo las que tienen contenido.
  const secciones: { clave: string; titulo: string; contenido: React.ReactNode }[] = []
  if (tieneTexto(p.problema) || p.preguntaNegocio) {
    secciones.push({
      clave: 'contexto',
      titulo: t('contexto'),
      contenido: (
        <>
          <Prosa data={p.problema} />
          {p.preguntaNegocio && <p className="pregunta">{p.preguntaNegocio}</p>}
        </>
      ),
    })
  }
  if (tieneTexto(p.metodo) || tieneTexto(p.datosLimpieza) || p.pasos.length > 0) {
    secciones.push({
      clave: 'que-hice',
      titulo: t('queHice'),
      contenido: (
        <>
          <Prosa data={p.metodo} />
          {p.pasos.length > 0 && (
            <ol className="pasos">
              {p.pasos.map((s, n) => (
                <li className={`paso${s.color !== 'ninguno' ? ` paso--${s.color}` : ''}`} key={n}>
                  <span className="paso__etiqueta">{s.etiqueta}</span>
                  <strong>{s.titulo}</strong>
                  {s.texto && <span>{s.texto}</span>}
                </li>
              ))}
            </ol>
          )}
          <Prosa data={p.datosLimpieza} />
          {p.fuentes.length > 0 && (
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
        </>
      ),
    })
  }
  if (tieneTexto(p.resultado) || capturas.length > 0 || p.graficos.length > 0) {
    secciones.push({
      clave: 'que-encontre',
      titulo: t('queEncontre'),
      contenido: (
        <>
          <Prosa data={p.resultado} />
          {capturas.map((c, n) => (
            <figure className="figura" key={n}>
              <Ventana imagen={c} titulo={c.titulo} />
              {c.leyenda && <figcaption>{c.leyenda}</figcaption>}
            </figure>
          ))}
          {p.graficos.map((g) => (
            <Grafico key={g.archivo} archivo={g.archivo} titulo={g.titulo} locale={locale} />
          ))}
        </>
      ),
    })
  }
  if (p.simulador === 'china-2024') {
    secciones.push({
      clave: 'simulador',
      titulo: t('simTitulo'),
      contenido: (
        <>
          <p>{t('simIntro')}</p>
          <SimuladorChina
            locale={locale}
            textos={{
              precio: t('simPrecio'),
              volumen: t('simVolumen'),
              real: t('simReal'),
              escenario: t('simEscenario'),
              impacto: t('simImpacto'),
              pct: t('simPct'),
              nota: t('simNota'),
              leyendaReal: t('simLeyendaReal'),
              leyendaEsc: t('simLeyendaEsc'),
              regiones: t('simRegiones'),
            }}
          />
        </>
      ),
    })
  }
  if (p.decisiones.length > 0) {
    secciones.push({
      clave: 'decisiones',
      titulo: t('decisiones'),
      contenido: (
        <ul className="decisiones">
          {p.decisiones.map((d) => (
            <li className="tarjeta-base" key={d.titulo}>
              <h3>{d.titulo}</h3>
              <p>{d.texto}</p>
            </li>
          ))}
        </ul>
      ),
    })
  }
  if (tieneTexto(p.aprendizajes)) {
    secciones.push({ clave: 'aprendizajes', titulo: t('aprendizajes'), contenido: <Prosa data={p.aprendizajes} /> })
  }

  const ficha: [string, React.ReactNode][] = [
    [t('fichaTipo'), p.ficha.tipo ?? t(`area.${p.area}`)],
    ...(p.ficha.periodo ? ([[t('fichaPeriodo'), p.ficha.periodo]] as [string, React.ReactNode][]) : []),
    ...(p.ficha.fuentesDatos ? ([[t('fichaFuentes'), p.ficha.fuentesDatos]] as [string, React.ReactNode][]) : []),
    ...(p.tecnologias.length
      ? ([
          [
            t('fichaStack'),
            <ul className="chips" key="s">
              {p.tecnologias.map((x) => (
                <li className="chip" key={x}>
                  {x}
                </li>
              ))}
            </ul>,
          ],
        ] as [string, React.ReactNode][])
      : []),
    ...(p.ficha.calidad ? ([[t('fichaCalidad'), p.ficha.calidad]] as [string, React.ReactNode][]) : []),
  ]

  return (
    <Pagina locale={locale} actual="/projects/[slug]" alternas={alternas}>
      <article>
        <header className="contenedor caso-cabecera" data-section="cabecera">
          <a className="nota" href={ruta(locale, '/projects')} style={{ textDecoration: 'none' }}>
            <span aria-hidden="true">←</span> {t('todos')}
          </a>
          <p className="sobretitulo" style={{ marginTop: 'var(--space-4)' }}>
            {t('casoEyebrow')} · {p.titulo.toUpperCase()}
          </p>
          <h1>{p.titular ?? p.titulo}</h1>
          {p.resumen && <p className="lead">{p.resumen}</p>}
          {(p.repositorio || p.demo || p.enlaces.length > 0) && (
            <div className="caso-acciones">
              {p.demo && (
                <a className="boton boton--primario" href={p.demo} target="_blank" rel="noopener noreferrer">
                  {t('probarDemo')} ↗
                </a>
              )}
              {p.repositorio && (
                <a
                  className={`boton ${p.demo ? 'boton--secundario' : 'boton--primario'}`}
                  href={p.repositorio}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('repositorio')} ↗
                </a>
              )}
              {p.enlaces.map((e) => (
                <a className="boton boton--secundario" href={e.url} target="_blank" rel="noopener noreferrer" key={e.url}>
                  {e.texto} ↗
                </a>
              ))}
            </div>
          )}
          <div className="caso-principal">
            {principal ? <Ventana imagen={principal} titulo={tituloPrincipal} prioridad /> : <div />}
            <aside className="tarjeta-base ficha" aria-label={t('fichaTitulo')}>
              <dl>
                {ficha.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </header>

        <div className="contenedor">
          {p.hallazgos.length > 0 && (
            <section className="seccion" data-section="resumen" aria-labelledby="h-resumen" style={{ paddingBlock: 'var(--space-5)' }}>
              <h2 className="sobretitulo" id="h-resumen">
                {t('enResumen')}
              </h2>
              <ul className="kpis">
                {p.hallazgos.map((h, n) => (
                  <li className="tarjeta-base kpi" key={n}>
                    <strong className={h.tono === 'destacado' ? 'grad' : h.tono === 'riesgo' ? 'riesgo' : undefined}>{h.cifra}</strong>
                    <span>{h.texto}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {secciones.map((s, n) => (
            <section className="bloque" key={s.clave} data-section={s.clave} aria-labelledby={`h-${s.clave}`}>
              <span className="bloque__num" aria-hidden="true">
                {String(n + 1).padStart(2, '0')}
              </span>
              <div>
                <h2 id={`h-${s.clave}`}>{s.titulo}</h2>
                {s.contenido}
              </div>
            </section>
          ))}

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
