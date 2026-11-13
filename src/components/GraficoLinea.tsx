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
          <CartesianGrid stroke="#30363d" vertical={false} />
          <XAxis
            dataKey="mes"
            tickFormatter={fmtMes}
            tick={{ fill: '#8b949e', fontSize: 12 }}
            axisLine={{ stroke: '#30363d' }}
            tickLine={false}
            minTickGap={24}
          />
          <YAxis
            tick={{ fill: '#8b949e', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            domain={['dataMin - 5', 'dataMax + 5']}
            tickFormatter={(v: number) => fmtNum(Math.round(v))}
            width={48}
          />
          <Tooltip
            cursor={{ stroke: '#6e7681', strokeWidth: 1 }}
            formatter={(v) => [fmtNum(Number(v)), etiquetaValor]}
            labelFormatter={(l) => fmtMes(String(l))}
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #30363d',
              background: '#161b22',
              color: '#e6edf3',
              fontSize: 13,
            }}
          />
          <Line
            type="monotone"
            dataKey="valor"
            stroke="#22d3ee"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5, stroke: '#0d1117', strokeWidth: 2, fill: '#22d3ee' }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
