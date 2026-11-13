import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ComoTrabajo, LlamadoContacto } from '@/components/Bloques'
import { Pagina } from '@/components/Pagina'
import { TarjetaServicio } from '@/components/TarjetaServicio'
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
  const [t, servicios] = await Promise.all([getTranslations({ locale, namespace: 'servicios' }), getServicios(locale)])
  const grupos = [
    { clave: 'datos' as const, titulo: t('grupoDatos'), texto: t('grupoDatosTexto') },
    { clave: 'sistemas' as const, titulo: t('grupoSistemas'), texto: t('grupoSistemasTexto') },
  ]
    .map((g) => ({ ...g, servicios: servicios.filter((s) => s.grupo === g.clave) }))
    .filter((g) => g.servicios.length > 0)

  return (
    <Pagina locale={locale} actual="/services" alternas={alternasDe('/services')}>
      <header className="contenedor cabecera-pagina" data-section="cabecera">
        <p className="sobretitulo">{t('eyebrow')}</p>
        <h1>
          {t('tituloA')} <span className="grad">{t('tituloB')}</span>
        </h1>
        <p className="lead">{t('intro')}</p>
      </header>

      <div className="contenedor" data-section="catalogo">
        {grupos.length === 0 ? (
          <p className="vacio">{t('vacio')}</p>
        ) : (
          grupos.map((g) => (
            <section className="grupo" key={g.clave} aria-labelledby={`g-${g.clave}`} data-grupo={g.clave}>
              <div className="grupo__cabeza">
                <h2 id={`g-${g.clave}`}>{g.titulo}</h2>
                <p>{g.texto}</p>
              </div>
              <ul className="catalogo">
                {g.servicios.map((s) => (
                  <li key={s.id}>
                    <TarjetaServicio locale={locale} s={s} />
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>

      <div style={{ marginTop: 'var(--space-6)' }}>
        <ComoTrabajo locale={locale} />
      </div>
      <LlamadoContacto locale={locale} titulo={t('ctaTitulo')} texto={t('ctaTexto')} />
    </Pagina>
  )
}
