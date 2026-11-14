import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import type { ProyectoTarjeta } from '@/lib/data/public'
import { rutaProyecto } from '@/lib/rutas'

export async function TarjetaProyecto({ locale, p, encabezado = 'h3' }: { locale: Locale; p: ProyectoTarjeta; encabezado?: 'h2' | 'h3' }) {
  const t = await getTranslations({ locale, namespace: 'proyectos' })
  const Titulo = encabezado
  return (
    <article className="pc" data-proyecto={p.slug}>
      <div className={`pc__imagen${p.portada ? '' : ' pc__imagen--vacia'}`}>
        {p.portada ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.portada.url} srcSet={p.portada.srcSet} sizes={p.portada.srcSet ? '(max-width: 760px) 100vw, 560px' : undefined} alt="" width={p.portada.ancho ?? 1600} height={p.portada.alto ?? 900} loading="lazy" decoding="async" />
        ) : (
          <span aria-hidden="true">{'{ }'}</span>
        )}
        {p.portadaEtiqueta && <span className="chip chip--cian">{p.portadaEtiqueta}</span>}
      </div>
      <div className="pc__cuerpo">
        <span className="pc__tipo">{t(`area.${p.area}`)}</span>
        <Titulo className="pc__titulo">
          <a href={rutaProyecto(locale, p.slug)}>{p.titulo}</a>
        </Titulo>
        {p.resumen && <p className="pc__resumen">{p.resumen}</p>}
        {p.destacados.length > 0 && (
          <dl className="pc__datos">
            {p.destacados.map((d, i) => (
              <div key={i}>
                <dt className={i === 0 ? 'grad' : undefined}>{d.cifra}</dt>
                <dd>{d.texto}</dd>
              </div>
            ))}
          </dl>
        )}
        {p.tecnologias.length > 0 && (
          <ul className="chips" aria-label={t('tecnologias')}>
            {p.tecnologias.map((x) => (
              <li className="chip" key={x}>
                {x}
              </li>
            ))}
          </ul>
        )}
        <div className="pc__pie">
          {p.demo ? (
            <a className="pc__externo" href={p.demo} target="_blank" rel="noopener noreferrer">
              {t('probarDemo')} ↗
            </a>
          ) : p.repositorio ? (
            <a className="pc__externo" href={p.repositorio} target="_blank" rel="noopener noreferrer">
              GitHub ↗
            </a>
          ) : (
            <span />
          )}
          <span className="pc__ver" aria-hidden="true">
            {t('verCaso')} →
          </span>
        </div>
      </div>
    </article>
  )
}
