import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ComoTrabajo, LlamadoContacto } from '@/components/Bloques'
import { Pagina } from '@/components/Pagina'
import { TarjetaProyecto } from '@/components/TarjetaProyecto'
import { TarjetaServicio } from '@/components/TarjetaServicio'
import type { Locale } from '@/i18n/routing'
import { getPerfil, getProyectos, getServicios } from '@/lib/data/public'
import { metadatos } from '@/lib/metadatos'
import { alternasDe, ruta } from '@/lib/rutas'

type P = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params
  const [t, perfil] = await Promise.all([getTranslations({ locale, namespace: 'meta' }), getPerfil(locale)])
  return {
    ...metadatos({
      locale,
      titulo: perfil.seoTitulo ?? t('sitio'),
      descripcion: perfil.seoDescripcion ?? t('descripcion'),
      alternas: alternasDe('/'),
      propia: ruta(locale, '/'),
    }),
    title: { absolute: perfil.seoTitulo ?? t('sitio') },
  }
}

export default async function Inicio({ params }: P) {
  const { locale } = await params
  setRequestLocale(locale)
  const [t, tp, perfil, proyectos, servicios] = await Promise.all([
    getTranslations({ locale, namespace: 'inicio' }),
    getTranslations({ locale, namespace: 'proyectos' }),
    getPerfil(locale),
    getProyectos(locale),
    getServicios(locale),
  ])
  const [nombre, ...apellidos] = perfil.nombrePublico.split(' ')
  const destacados = [...proyectos].sort((a, b) => Number(b.destacado) - Number(a.destacado)).slice(0, 4)
  const herramientas = [...new Set(proyectos.flatMap((p) => p.tecnologias).concat(servicios.flatMap((s) => s.herramientas)))].slice(0, 9)
  const serviciosInicio = servicios.filter((s) => s.estado === 'disponible').slice(0, 3)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: perfil.nombrePublico,
    jobTitle: perfil.titular || undefined,
    address: perfil.ubicacion ? { '@type': 'PostalAddress', addressLocality: perfil.ubicacion } : undefined,
    sameAs: [perfil.linkedin, perfil.github].filter(Boolean),
  }

  return (
    <Pagina locale={locale} actual="/" alternas={alternasDe('/')}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <section className="contenedor hero" data-section="hero">
        <div>
          {perfil.disponible && <p className="punto-disponible">{t('disponible')}</p>}
          <h1 className="hero__nombre">
            {nombre} <em className="grad">{apellidos.join(' ')}</em>
          </h1>
          {perfil.titular && <p className="hero__titular">{perfil.titular}</p>}
          {perfil.presentacion && <p className="hero__presentacion">{perfil.presentacion}</p>}
          <div className="hero__acciones">
            <a className="boton boton--primario" href={ruta(locale, '/contact')}>
              {t('contactar')}
            </a>
            <a className="boton boton--secundario" href={`/${locale}/cv.pdf`} download>
              {t('descargarCV')}
            </a>
            <a className="enlace-flecha" href={ruta(locale, '/projects')}>
              {t('verProyectos')} <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        <div className="panel-foto">
          {perfil.foto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={perfil.foto.url}
              alt={perfil.foto.alt}
              width={perfil.foto.ancho ?? 800}
              height={perfil.foto.alto ?? 1000}
              fetchPriority="high"
            />
          ) : (
            <span className="monograma" aria-hidden="true">
              CR
            </span>
          )}
          {perfil.ubicacion && <span className="panel-foto__pie">{perfil.ubicacion}</span>}
        </div>
      </section>

      {herramientas.length > 0 && (
        <div className="contenedor" data-section="herramientas">
          <ul className="herramientas" aria-label={t('herramientas')}>
            <li className="herramientas__titulo" aria-hidden="true">
              {t('herramientas')}:
            </li>
            {herramientas.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
      )}

      <section className="seccion" data-section="proyectos">
        <div className="contenedor">
          <div className="seccion__cabeza">
            <div>
              <p className="sobretitulo">{t('proyectosEyebrow')}</p>
              <h2>{t('destacados')}</h2>
            </div>
            <a className="enlace-flecha" href={ruta(locale, '/projects')}>
              {t('todosProyectos')} <span aria-hidden="true">→</span>
            </a>
          </div>
          {destacados.length === 0 ? (
            <p className="vacio">{tp('vacio')}</p>
          ) : (
            <ul className={`proyectos-rejilla${destacados.length === 1 ? ' proyectos-rejilla--uno' : ''}`}>
              {destacados.map((p) => (
                <li key={p.id}>
                  <TarjetaProyecto locale={locale} p={p} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {serviciosInicio.length > 0 && (
        <section className="seccion" data-section="servicios">
          <div className="contenedor">
            <div className="seccion__cabeza">
              <div>
                <p className="sobretitulo">{t('queHagoEyebrow')}</p>
                <h2>{t('queHago')}</h2>
              </div>
              <a className="enlace-flecha" href={ruta(locale, '/services')}>
                {t('verCatalogo')} <span aria-hidden="true">→</span>
              </a>
            </div>
            <ul className="catalogo catalogo--tres">
              {serviciosInicio.map((s) => (
                <li key={s.id}>
                  <TarjetaServicio locale={locale} s={s} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <ComoTrabajo locale={locale} />
      <LlamadoContacto locale={locale} titulo={t('ctaTitulo')} texto={t('ctaTexto')} />
    </Pagina>
  )
}
