import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import type { ServicioPublico } from '@/lib/data/public'
import { rutaProyecto } from '@/lib/rutas'
import { Icono } from './Icono'

export async function TarjetaServicio({ locale, s, encabezado = 'h3' }: { locale: Locale; s: ServicioPublico; encabezado?: 'h2' | 'h3' }) {
  const t = await getTranslations({ locale, namespace: 'servicios' })
  const Titulo = encabezado
  const cian = s.icono === 'base' || s.icono === 'pantalla'
  return (
    <article className="tarjeta-base sv" data-servicio={s.id}>
      <div className="sv__cabeza">
        <span className={`sv__icono${cian ? ' sv__icono--cian' : ''}`}>
          <Icono nombre={s.icono} />
        </span>
        <Titulo>{s.nombre}</Titulo>
      </div>
      <p className="sv__dolor">
        {s.dolor && (
          <>
            <q>{s.dolor}</q>{' '}
          </>
        )}
        {s.descripcion}
      </p>
      {s.entregables.length > 0 && (
        <div>
          <p className="sv__etiqueta">{t('queEntrego')}</p>
          <ul className="sv__entregables">
            {s.entregables.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}
      {s.herramientas.length > 0 && (
        <ul className="chips">
          {s.herramientas.map((h) => (
            <li className="chip" key={h}>
              {h}
            </li>
          ))}
        </ul>
      )}
      <div className="sv__pie">
        {s.estado === 'proximamente' || (!s.ejemplo && !s.demoUrl) ? (
          <>
            <span className="nota">{t('enPreparacion')}</span>
            <span className="proximamente">{t('proximamente')}</span>
          </>
        ) : (
          <>
            <span className="nota">{s.ejemplo ? t('ejemplo', { titulo: s.ejemplo.titulo }) : ''}</span>
            {s.demoUrl ? (
              <a href={s.demoUrl} target="_blank" rel="noopener noreferrer">
                {t('probarDemo')} ↗
              </a>
            ) : (
              s.ejemplo && <a href={rutaProyecto(locale, s.ejemplo.slug)}>{t('verCaso')} →</a>
            )}
          </>
        )}
      </div>
    </article>
  )
}
