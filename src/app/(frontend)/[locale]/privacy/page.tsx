import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Pagina } from '@/components/Pagina'
import { Prosa } from '@/components/Prosa'
import type { Locale } from '@/i18n/routing'
import { getTextos } from '@/lib/data/public'
import { metadatos } from '@/lib/metadatos'
import { alternasDe, ruta } from '@/lib/rutas'

type P = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'privacidad' })
  return metadatos({
    locale,
    titulo: t('titulo'),
    descripcion: t('titulo'),
    alternas: alternasDe('/privacy'),
    propia: ruta(locale, '/privacy'),
  })
}

export default async function Privacidad({ params }: P) {
  const { locale } = await params
  setRequestLocale(locale)
  const [t, textos] = await Promise.all([getTranslations({ locale, namespace: 'privacidad' }), getTextos(locale)])
  return (
    <Pagina locale={locale} actual="/privacy" alternas={alternasDe('/privacy')}>
      <header className="contenedor cabecera-pagina" data-section="cabecera">
        <h1>{t('titulo')}</h1>
        {textos.actualizado && (
          <p className="linea__periodo">
            {t('actualizado', {
              fecha: new Date(textos.actualizado).toLocaleDateString(locale === 'es' ? 'es-EC' : 'en-US', { dateStyle: 'long' }),
            })}
          </p>
        )}
      </header>
      <section className="contenedor" data-section="texto" style={{ paddingBottom: 'var(--space-6)' }}>
        <Prosa data={textos.avisoPrivacidad} />
        {process.env.NEXT_PUBLIC_ANALYTICS === 'true' && (
          <div className="prosa" data-section="analitica">
            <h3>{t('analiticaTitulo')}</h3>
            <p>{t('analiticaTexto')}</p>
          </div>
        )}
      </section>
    </Pagina>
  )
}
