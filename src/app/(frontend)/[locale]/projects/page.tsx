import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ListaProyectos } from '@/components/ListaProyectos'
import { Pagina } from '@/components/Pagina'
import type { Locale } from '@/i18n/routing'
import { getProyectos } from '@/lib/data/public'
import { metadatos } from '@/lib/metadatos'
import { alternasDe, ruta } from '@/lib/rutas'

type P = { params: Promise<{ locale: Locale }>; searchParams: Promise<{ aviso?: string }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'proyectos' })
  return metadatos({
    locale,
    titulo: t('titulo'),
    descripcion: t('intro'),
    alternas: alternasDe('/projects'),
    propia: ruta(locale, '/projects'),
  })
}

export default async function Proyectos({ params, searchParams }: P) {
  const { locale } = await params
  const { aviso } = await searchParams
  setRequestLocale(locale)
  const [t, tn, proyectos] = await Promise.all([
    getTranslations({ locale, namespace: 'proyectos' }),
    getTranslations({ locale, namespace: 'nav' }),
    getProyectos(locale),
  ])
  return (
    <Pagina locale={locale} actual="/projects" alternas={alternasDe('/projects')}>
      <header className="contenedor cabecera-pagina" data-section="cabecera">
        {aviso === 'sin-traduccion' && (
          <p className="aviso-simulado" role="status">
            {tn('sinTraduccion')}
          </p>
        )}
        <h1>{t('titulo')}</h1>
        <p className="lead">{t('intro')}</p>
      </header>
      <section className="contenedor" data-section="lista" style={{ paddingBottom: 'var(--space-6)' }}>
        <ListaProyectos locale={locale} proyectos={proyectos} />
      </section>
    </Pagina>
  )
}
