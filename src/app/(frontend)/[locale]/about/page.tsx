import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Pagina } from '@/components/Pagina'
import { Prosa } from '@/components/Prosa'
import type { Locale } from '@/i18n/routing'
import { getCertificaciones, getFormacion, getIdiomas, getPerfil, getTrayectoria } from '@/lib/data/public'
import { metadatos } from '@/lib/metadatos'
import { alternasDe, ruta } from '@/lib/rutas'

type P = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params
  const [t, perfil] = await Promise.all([getTranslations({ locale, namespace: 'meta' }), getPerfil(locale)])
  return metadatos({
    locale,
    titulo: t('sobreMi'),
    descripcion: perfil.presentacion || t('descripcion'),
    alternas: alternasDe('/about'),
    propia: ruta(locale, '/about'),
  })
}

export default async function SobreMi({ params }: P) {
  const { locale } = await params
  setRequestLocale(locale)
  const [t, perfil, trayectoria, formacion, certificaciones, idiomas] = await Promise.all([
    getTranslations({ locale, namespace: 'sobreMi' }),
    getPerfil(locale),
    getTrayectoria(locale),
    getFormacion(locale),
    getCertificaciones(locale),
    getIdiomas(locale),
  ])

  return (
    <Pagina locale={locale} actual="/about" alternas={alternasDe('/about')}>
      <header className="contenedor cabecera-pagina" data-section="cabecera">
        <h1>{t('titulo')}</h1>
        {perfil.titular && <p className="lead">{perfil.titular}</p>}
      </header>

      {(perfil.sobreMi || perfil.presentacion) && (
        <section className="seccion" data-section="presentacion">
          <div className="contenedor">
            {perfil.sobreMi ? <Prosa data={perfil.sobreMi} /> : <p className="prosa">{perfil.presentacion}</p>}
          </div>
        </section>
      )}

      <section className="seccion" data-section="trayectoria" aria-labelledby="h-trayectoria">
        <div className="contenedor dos-columnas">
          <h2 id="h-trayectoria">{t('trayectoria')}</h2>
          {trayectoria.length === 0 ? (
            <p className="vacio">{t('vacioTrayectoria')}</p>
          ) : (
            <ol className="linea">
              {trayectoria.map((e) => (
                <li key={e.id}>
                  {e.periodo && <span className="linea__periodo">{e.periodo}</span>}
                  <h3>{e.cargo}</h3>
                  <p className="linea__org">{e.organizacion}</p>
                  {e.descripcion && <p>{e.descripcion}</p>}
                  {e.hijas.length > 0 && (
                    <ul className="linea__hijas">
                      {e.hijas.map((h) =>
                        h.breve ? (
                          <li key={h.id} className="linea__breve">
                            {h.cargo}
                            {h.periodo ? ` · ${h.periodo}` : ''}
                          </li>
                        ) : (
                          <li key={h.id}>
                            {h.periodo && <span className="linea__periodo">{h.periodo}</span>}
                            <p style={{ fontWeight: 600, margin: 0 }}>{h.cargo}</p>
                            <p className="linea__org" style={{ margin: 0 }}>
                              {h.organizacion}
                            </p>
                            {h.descripcion && <p style={{ margin: 'var(--space-2) 0 0' }}>{h.descripcion}</p>}
                          </li>
                        ),
                      )}
                    </ul>
                  )}
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      <section className="seccion" data-section="formacion" aria-labelledby="h-formacion">
        <div className="contenedor dos-columnas">
          <h2 id="h-formacion">{t('formacion')}</h2>
          {formacion.length === 0 ? (
            <p className="vacio">{t('vacioFormacion')}</p>
          ) : (
            <ol className="linea">
              {formacion.map((f) => (
                <li key={f.id}>
                  {f.anio && <span className="linea__periodo">{f.anio}</span>}
                  <h3>{f.nombre}</h3>
                  <p className="linea__org">{f.institucion}</p>
                  {f.detalle && <p style={{ margin: 0 }}>{f.detalle}</p>}
                  {f.nombreEnCredencial && f.nombreEnCredencial !== perfil.nombrePublico && (
                    <p className="linea__breve" style={{ margin: 'var(--space-2) 0 0' }}>
                      {t('credencialA', { nombre: f.nombreEnCredencial })}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      {certificaciones.length > 0 && (
        <section className="seccion" data-section="certificaciones" aria-labelledby="h-cert">
          <div className="contenedor dos-columnas">
            <h2 id="h-cert">{t('certificaciones')}</h2>
            <ul className="linea">
              {certificaciones.map((c) => (
                <li key={c.id}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2) var(--space-3)', alignItems: 'baseline' }}>
                    <h3 lang="en">{c.nombre}</h3>
                    <span className={`estado ${c.estado === 'obtenida' ? 'estado--obtenida' : 'estado--prep'}`}>
                      {c.estado === 'obtenida' ? t('obtenida') : t('enPreparacion')}
                    </span>
                  </div>
                  <p className="linea__org" style={{ margin: 0 }}>
                    {[c.emisor, c.plataforma, c.anio].filter(Boolean).join(' · ')}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {idiomas.length > 0 && (
        <section className="seccion" data-section="idiomas" aria-labelledby="h-idiomas">
          <div className="contenedor dos-columnas">
            <h2 id="h-idiomas">{t('idiomas')}</h2>
            <ul className="linea">
              {idiomas.map((i) => (
                <li key={i.id}>
                  <h3>{i.idioma}</h3>
                  <p className="linea__org" style={{ margin: 0 }}>
                    {i.nivel}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </Pagina>
  )
}
