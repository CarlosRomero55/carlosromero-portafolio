import { getTranslations } from 'next-intl/server'
import camaron from '../../data/synthetic/camaron-exportaciones.json'
import type { Locale } from '@/i18n/routing'
import { GraficoCliente } from './GraficoCliente'

const ARCHIVOS: Record<string, { puntos: { mes: string; valor: number }[]; unidad: string }> = {
  'camaron-exportaciones': camaron,
}

/** Gráfico SIMULADO: aviso visible + tabla accesible con los mismos datos. */
export async function Grafico({ archivo, titulo, locale }: { archivo: string; titulo: string; locale: Locale }) {
  const datos = ARCHIVOS[archivo]
  if (!datos) return null
  const t = await getTranslations({ locale, namespace: 'proyectos' })
  const etiquetaValor = locale === 'es' ? 'Índice (simulado)' : 'Index (simulated)'
  return (
    <figure className="figura" data-simulado="true">
      <figcaption>{titulo}</figcaption>
      <p className="aviso-simulado">
        <strong>{t('simulado')}</strong>
        <span>{t('avisoSimulado')}</span>
      </p>
      <GraficoCliente puntos={datos.puntos} locale={locale} etiquetaValor={etiquetaValor} />
      <details className="datos-tabla">
        <summary>{t('tablaDatos')}</summary>
        <table className="tabla-datos">
          <caption className="sr-only">
            {titulo} — {t('simulado')}
          </caption>
          <thead>
            <tr>
              <th scope="col">{t('mes')}</th>
              <th scope="col">{etiquetaValor}</th>
            </tr>
          </thead>
          <tbody>
            {datos.puntos.map((p) => (
              <tr key={p.mes}>
                <td>{p.mes}</td>
                <td>{p.valor.toLocaleString(locale === 'es' ? 'es-EC' : 'en-US')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  )
}
