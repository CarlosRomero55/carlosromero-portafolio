import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ListaProyectos } from '@/components/ListaProyectos'
import { Pagina } from '@/components/Pagina'
import { TarjetasServicios } from '@/components/Servicios'
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
  const [t, perfil, proyectos, servicios] = await Promise.all([
    getTranslations({ locale, namespace: 'inicio' }),
    getPerfil(locale),
    getProyectos(locale),
    getServicios(locale),
  ])
  const [nombre, ...apellidos] = perfil.nombrePublico.split(' ')

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
        // JSON.stringify + reemplazo de "<" impide cerrar la etiqueta desde el contenido.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <section className="contenedor hero" data-section="hero">
        <div>
          {perfil.disponible && <p className="punto-disponible">{t('disponible')}</p>}
          <h1 className="hero__nombre">
            {nombre} <em>{apellidos.join(' ')}</em>
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
              width={perfil.foto.ancho ?? 600}
              height={perfil.foto.alto ?? 750}
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

      {servicios.length > 0 && (
        <section className="seccion" data-section="servicios">
          <div className="contenedor">
            <div className="seccion__cabeza">
              <h2>{t('queHago')}</h2>
              <a className="enlace-flecha" href={ruta(locale, '/services')}>
                {t('verServicios')} <span aria-hidden="true">→</span>
              </a>
            </div>
            <TarjetasServicios servicios={servicios} />
          </div>
        </section>
      )}

      <section className="seccion" data-section="proyectos">
        <div className="contenedor">
          <div className="seccion__cabeza">
            <h2>{t('destacados')}</h2>
          </div>
          <ListaProyectos locale={locale} proyectos={proyectos.slice(0, 3)} />
        </div>
      </section>
    </Pagina>
  )
}
