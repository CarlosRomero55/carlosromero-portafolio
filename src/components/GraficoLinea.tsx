'use client'

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type Punto = { mes: string; valor: number }

export default function GraficoLinea({
  puntos,
  locale,
  etiquetaValor,
}: {
  puntos: Punto[]
  locale: string
  etiquetaValor: string
}) {
  const fmtMes = (m: string) =>
    new Date(`${m}-01T12:00:00Z`).toLocaleDateString(locale === 'es' ? 'es-EC' : 'en-US', {
      month: 'short',
      year: '2-digit',
      timeZone: 'UTC',
    })
  const fmtNum = (n: number) => n.toLocaleString(locale === 'es' ? 'es-EC' : 'en-US', { maximumFractionDigits: 1 })

  return (
    <div className="grafico" aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart accessibilityLayer={false} data={puntos} margin={{ top: 8, right: 12, bottom: 0, left: -8 }}>
          <CartesianGrid stroke="#e6e1d3" vertical={false} />
          <XAxis
            dataKey="mes"
            tickFormatter={fmtMes}
            tick={{ fill: '#5f5a4b', fontSize: 12 }}
            axisLine={{ stroke: '#e6e1d3' }}
            tickLine={false}
            minTickGap={24}
          />
          <YAxis
            tick={{ fill: '#5f5a4b', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            domain={['dataMin - 5', 'dataMax + 5']}
            tickFormatter={(v: number) => fmtNum(Math.round(v))}
            width={48}
          />
          <Tooltip
            cursor={{ stroke: '#8a846f', strokeWidth: 1 }}
            formatter={(v) => [fmtNum(Number(v)), etiquetaValor]}
            labelFormatter={(l) => fmtMes(String(l))}
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #e6e1d3',
              color: '#1f1d18',
              fontSize: 13,
            }}
          />
          <Line
            type="monotone"
            dataKey="valor"
            stroke="#2f6f73"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5, stroke: '#ffffff', strokeWidth: 2, fill: '#2f6f73' }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
