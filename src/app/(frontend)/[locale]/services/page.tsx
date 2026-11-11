import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Pagina } from '@/components/Pagina'
import { TarjetasServicios } from '@/components/Servicios'
import type { Locale } from '@/i18n/routing'
import { getServicios } from '@/lib/data/public'
import { metadatos } from '@/lib/metadatos'
import { alternasDe, ruta } from '@/lib/rutas'

type P = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'servicios' })
  return metadatos({
    locale,
    titulo: t('titulo'),
    descripcion: t('intro'),
    alternas: alternasDe('/services'),
    propia: ruta(locale, '/services'),
  })
}

export default async function Servicios({ params }: P) {
  const { locale } = await params
  setRequestLocale(locale)
  const [t, tn, servicios] = await Promise.all([
    getTranslations({ locale, namespace: 'servicios' }),
    getTranslations({ locale, namespace: 'inicio' }),
    getServicios(locale),
  ])
  return (
    <Pagina locale={locale} actual="/services" alternas={alternasDe('/services')}>
      <header className="contenedor cabecera-pagina" data-section="cabecera">
        <h1>{t('titulo')}</h1>
        <p className="lead">{t('intro')}</p>
      </header>
      <section className="seccion" data-section="servicios">
        <div className="contenedor">
          {servicios.length === 0 ? <p className="vacio">{t('vacio')}</p> : <TarjetasServicios servicios={servicios} />}
        </div>
      </section>
      <section className="seccion" data-section="cta">
        <div className="contenedor" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 'var(--fs-h2)' }}>{t('cta')}</h2>
          <a className="boton boton--primario" href={ruta(locale, '/contact')}>
            {tn('contactar')}
          </a>
        </div>
      </section>
    </Pagina>
  )
}
