import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import type { ProyectoTarjeta } from '@/lib/data/public'
import { rutaProyecto } from '@/lib/rutas'

export async function ListaProyectos({ locale, proyectos }: { locale: Locale; proyectos: ProyectoTarjeta[] }) {
  const t = await getTranslations({ locale, namespace: 'proyectos' })
  if (proyectos.length === 0) return <p className="vacio">{t('vacio')}</p>
  return (
    <ol className="filas">
      {proyectos.map((p, i) => (
        <li className="fila" key={p.id} data-proyecto={p.slug}>
          <a href={rutaProyecto(locale, p.slug)}>
            <span className="fila__num" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span>
              <span className="fila__titulo">{p.titulo}</span>
              <span className="fila__resumen" style={{ display: 'block' }}>
                {p.resumen}
              </span>
              <span className="etiquetas" style={{ display: 'flex' }}>
                <span className="etiqueta">{t(`area.${p.area}`)}</span>
                {p.tecnologias.map((x) => (
                  <span className="etiqueta" key={x}>
                    {x}
                  </span>
                ))}
              </span>
            </span>
            <span className="fila__flecha" aria-hidden="true">
              →
            </span>
          </a>
        </li>
      ))}
    </ol>
  )
}
