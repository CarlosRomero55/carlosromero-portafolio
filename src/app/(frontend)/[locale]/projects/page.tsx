import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Pagina } from '@/components/Pagina'
import { TarjetaProyecto } from '@/components/TarjetaProyecto'
import type { Locale } from '@/i18n/routing'
import { getProyectos, type ProyectoTarjeta } from '@/lib/data/public'
import { metadatos } from '@/lib/metadatos'
import { alternasDe, ruta } from '@/lib/rutas'

type P = { params: Promise<{ locale: Locale }>; searchParams: Promise<{ aviso?: string; tipo?: string }> }

const FILTROS = ['todos', 'datos', 'web'] as const
type Filtro = (typeof FILTROS)[number]
const esDeTipo = (p: ProyectoTarjeta, f: Filtro) => f === 'todos' || (f === 'web' ? p.area === 'web' : p.area !== 'web')

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
  const { aviso, tipo } = await searchParams
  setRequestLocale(locale)
  const filtro: Filtro = (FILTROS as readonly string[]).includes(tipo ?? '') ? (tipo as Filtro) : 'todos'
  const [t, tn, proyectos] = await Promise.all([
    getTranslations({ locale, namespace: 'proyectos' }),
    getTranslations({ locale, namespace: 'nav' }),
    getProyectos(locale),
  ])
  const visibles = proyectos.filter((p) => esDeTipo(p, filtro))
  const etiqueta: Record<Filtro, string> = { todos: t('filtroTodos'), datos: t('filtroDatos'), web: t('filtroWeb') }
  const base = ruta(locale, '/projects')

  return (
    <Pagina locale={locale} actual="/projects" alternas={alternasDe('/projects')}>
      <header className="contenedor cabecera-pagina" data-section="cabecera">
        {aviso === 'sin-traduccion' && (
          <p className="aviso-simulado" role="status">
            {tn('sinTraduccion')}
          </p>
        )}
        <p className="sobretitulo">{t('eyebrow')}</p>
        <h1>{t('titulo')}</h1>
        <p className="lead">{t('intro')}</p>
      </header>
      <section className="contenedor" data-section="lista" style={{ paddingBottom: 'var(--space-6)' }}>
        {proyectos.length > 0 && (
          <nav aria-label={t('filtros')}>
            <ul className="filtros">
              {FILTROS.map((f) => {
                const n = proyectos.filter((p) => esDeTipo(p, f)).length
                if (f !== 'todos' && n === 0) return null
                return (
                  <li key={f}>
                    <a href={f === 'todos' ? base : `${base}?tipo=${f}`} aria-current={filtro === f ? 'true' : undefined} data-filtro={f}>
                      {etiqueta[f]} · {n}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>
        )}
        {visibles.length === 0 ? (
          <p className="vacio">{t('vacio')}</p>
        ) : (
          <ul className={`proyectos-rejilla${visibles.length === 1 ? ' proyectos-rejilla--uno' : ''}`}>
            {visibles.map((p) => (
              <li key={p.id}>
                <TarjetaProyecto locale={locale} p={p} encabezado="h2" />
              </li>
            ))}
          </ul>
        )}
      </section>
    </Pagina>
  )
}
