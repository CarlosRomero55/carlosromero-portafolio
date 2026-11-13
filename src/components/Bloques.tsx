import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { ruta } from '@/lib/rutas'

export async function ComoTrabajo({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'servicios' })
  const pasos = [1, 2, 3, 4] as const
  return (
    <section className="seccion" data-section="como-trabajo" aria-labelledby="h-como">
      <div className="contenedor">
        <p className="sobretitulo">{t('comoEyebrow')}</p>
        <h2 id="h-como" style={{ fontSize: 'var(--fs-h2)', marginBottom: 'var(--space-5)' }}>
          {t('comoTitulo')}
        </h2>
        <ol className="pasos-trabajo">
          {pasos.map((n) => (
            <li className="tarjeta-base" key={n}>
              <h3>{t(`paso${n}`)}</h3>
              <p>{t(`paso${n}Texto`)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export async function LlamadoContacto({ locale, titulo, texto }: { locale: Locale; titulo: string; texto: string }) {
  const t = await getTranslations({ locale, namespace: 'inicio' })
  return (
    <div className="contenedor" data-section="cta">
      <div className="cta">
        <div>
          <h2>{titulo}</h2>
          <p className="lead" style={{ marginTop: 'var(--space-2)' }}>
            {texto}
          </p>
        </div>
        <a className="boton boton--primario" href={ruta(locale, '/contact')}>
          {t('contactar')}
        </a>
      </div>
    </div>
  )
}
