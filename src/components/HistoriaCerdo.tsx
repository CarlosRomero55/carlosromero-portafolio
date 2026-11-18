'use client'

import { useEffect, useRef, useState } from 'react'
import { DATOS_CERDO as D } from '@/lib/historia-cerdo'

/**
 * Historia por pasos (scrollytelling) del caso Pork to China.
 * Datos REALES exportados de pork_gold (tools/export_web.py del repositorio pork-to-china).
 * Escritorio: el gráfico queda fijo a un lado y cambia según el paso visible.
 * Celular o movimiento reducido: cada paso muestra su propio gráfico debajo del texto.
 * Los gráficos son de apoyo (aria-hidden); cada paso trae su texto completo y una descripción para lectores de pantalla.
 */

export type TextosHistoria = {
  pasos: { titulo: string; texto: string; descripcion: string }[]
  paises: Record<'BRA' | 'CRI' | 'CHL' | 'ECU', string>
  disparadores: Record<'D1' | 'D2' | 'D3' | 'D4' | 'D5', string>
  estados: Record<'cumplido' | 'en camino' | 'no cumplido', string>
  ejes: { participacion: string; millonesT: string; usdKg: string; anios: string }
  waterfall: [string, string, string, string]
  sinProtocolo: string
  ecuadorBarra: string
  hoy: string
  umbral: string
  fuente: string
}

const W = 600
const H = 330
const M = { t: 24, r: 16, b: 34, l: 44 }
const COL = { dato: 'var(--cy)', contexto: '#4b5563', riesgo: 'var(--riesgo)', ok: 'var(--ok)', marca: 'var(--vio)', tinta: 'var(--fg-2)', suave: 'var(--muted)', linea: 'var(--line)' }

function nf(locale: string, dec = 0) {
  return new Intl.NumberFormat(locale === 'es' ? 'es-EC' : 'en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec })
}

/* ——— Gráfico 1 y 2: participación de EE. UU. ——— */
function Participacion({ foco, t, locale }: { foco: 'ventana' | 'cierre'; t: TextosHistoria; locale: string }) {
  const serie = D.us_share_value_pct as [string, number | null][]
  const n = serie.length
  const yMax = 40
  const x = (i: number) => M.l + (i / (n - 1)) * (W - M.l - M.r)
  const y = (v: number) => H - M.b - (v / yMax) * (H - M.t - M.b)
  const idx = (mes: string) => serie.findIndex(([m]) => m === mes)
  const tramo = (desde: number, hasta: number) => {
    let d = ''
    let abierto = false
    for (let i = desde; i <= hasta; i++) {
      const v = serie[i][1]
      if (v === null) {
        abierto = false
        continue
      }
      d += `${abierto ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`
      abierto = true
    }
    return d
  }
  const i18 = idx(D.cuts['2018'])
  const i20 = idx(D.cuts['2020'])
  const i25 = idx(D.cuts['2025'])
  const [a, b] = foco === 'ventana' ? [i25 - 12, n - 1] : [i18 - 12, i20 + 12]
  const cortes = foco === 'ventana' ? [[i25, '2025']] : [[i18, '2018'], [i20, '2020']]
  const f = nf(locale)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="historia__svg" focusable="false">
      {[0, 10, 20, 30, 40].map((v) => (
        <g key={v}>
          <line x1={M.l} x2={W - M.r} y1={y(v)} y2={y(v)} stroke={COL.linea} strokeWidth="1" />
          <text x={M.l - 8} y={y(v) + 4} textAnchor="end" className="historia__eje">
            {f.format(v)} %
          </text>
        </g>
      ))}
      {[2016, 2018, 2020, 2022, 2024, 2026].map((anio) => {
        const i = idx(`${anio}-01`)
        return i < 0 ? null : (
          <text key={anio} x={x(i)} y={H - 10} textAnchor="middle" className="historia__eje">
            {anio}
          </text>
        )
      })}
      <path d={tramo(0, n - 1)} fill="none" stroke={COL.contexto} strokeWidth="1.5" />
      <path d={tramo(a, b)} fill="none" stroke={COL.dato} strokeWidth="2.5" />
      {cortes.map(([i, etiqueta]) => (
        <g key={etiqueta}>
          <line x1={x(Number(i))} x2={x(Number(i))} y1={M.t} y2={H - M.b} stroke={COL.tinta} strokeDasharray="4 4" strokeWidth="1" />
          <text x={x(Number(i)) + 5} y={M.t + 10} className="historia__nota">
            {etiqueta}
          </text>
        </g>
      ))}
      <text x={M.l} y={14} className="historia__eje">
        {t.ejes.participacion}
      </text>
    </svg>
  )
}

/* ——— Gráfico 3: el mercado de China frente a lo que Ecuador podría colocar ——— */
function Mercado({ t, locale }: { t: TextosHistoria; locale: string }) {
  const anios = D.china_offal_imports_t.filter(([, , m]) => m === 12)
  const yMax = 1.4
  const paso = (W - M.l - M.r) / (anios.length + 1)
  const y = (v: number) => H - M.b - (v / yMax) * (H - M.t - M.b)
  const f1 = nf(locale, 1)
  const f2 = nf(locale, 2)
  const xe = M.l + anios.length * paso + paso * 0.15
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="historia__svg" focusable="false">
      {[0, 0.5, 1].map((v) => (
        <g key={v}>
          <line x1={M.l} x2={W - M.r} y1={y(v)} y2={y(v)} stroke={COL.linea} />
          <text x={M.l - 8} y={y(v) + 4} textAnchor="end" className="historia__eje">
            {f1.format(v)}
          </text>
        </g>
      ))}
      {anios.map(([anio, ton], i) => {
        const v = ton / 1e6
        return (
          <g key={anio}>
            <rect x={M.l + i * paso + paso * 0.15} width={paso * 0.7} y={y(v)} height={H - M.b - y(v)} rx="4" fill={COL.dato} />
            <text x={M.l + i * paso + paso / 2} y={y(v) - 6} textAnchor="middle" className="historia__eje">
              {f2.format(v)}
            </text>
            <text x={M.l + i * paso + paso / 2} y={H - 10} textAnchor="middle" className="historia__eje">
              {anio}
            </text>
          </g>
        )
      })}
      <rect x={xe} width={paso * 0.7} y={H - M.b - 2} height="2" fill={COL.marca} />
      <text x={xe + paso * 0.35} y={H - M.b - 10} textAnchor="middle" className="historia__nota">
        {t.ecuadorBarra}
      </text>
      <text x={M.l} y={14} className="historia__eje">
        {t.ejes.millonesT}
      </text>
    </svg>
  )
}

/* ——— Gráfico 4: años desde el protocolo hasta el primer envío ——— */
function Acceso({ t }: { t: TextosHistoria }) {
  const [x0, x1] = [2003, 2027]
  const x = (a: number) => M.l + 40 + ((a - x0) / (x1 - x0)) * (W - M.l - 40 - M.r)
  const filas = (['BRA', 'CRI', 'CHL', 'ECU'] as const).map((iso) => D.benchmark.find((b) => b.iso3 === iso)!)
  const alto = (H - M.t - M.b) / filas.length
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="historia__svg" focusable="false">
      {[2005, 2010, 2015, 2020, 2025].map((a) => (
        <g key={a}>
          <line x1={x(a)} x2={x(a)} y1={M.t} y2={H - M.b} stroke={COL.linea} />
          <text x={x(a)} y={H - 10} textAnchor="middle" className="historia__eje">
            {a}
          </text>
        </g>
      ))}
      {filas.map((b, i) => {
        const cy = M.t + alto * i + alto / 2
        const nombre = t.paises[b.iso3 as keyof TextosHistoria['paises']]
        return (
          <g key={b.iso3}>
            <text x={M.l + 30} y={cy + 4} textAnchor="end" className="historia__etiqueta">
              {nombre}
            </text>
            {b.start && b.first_export ? (
              <>
                <rect x={x(b.start)} width={x(b.first_export) - x(b.start)} y={cy - 9} height="18" rx="4" fill={COL.dato} />
                <text x={x(b.first_export) + 6} y={cy + 4} className="historia__nota">
                  {b.first_export - b.start} {t.ejes.anios}
                </text>
              </>
            ) : b.first_export ? (
              <circle cx={x(b.first_export)} cy={cy} r="7" fill={COL.dato} />
            ) : (
              <text x={x(2005)} y={cy + 4} className="historia__nota historia__nota--riesgo">
                {t.sinProtocolo}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

/* ——— Gráfico 5: margen por kilo ——— */
function Margen({ t, locale }: { t: TextosHistoria; locale: string }) {
  const m = D.margin_usd_kg
  const [yMin, yMax] = [-0.4, 1.8]
  const y = (v: number) => M.t + ((yMax - v) / (yMax - yMin)) * (H - M.t - M.b - 10)
  const paso = (W - M.l - M.r) / 4
  const f = nf(locale, 2)
  const barras: [number, number, string][] = [
    [0, m.fob, COL.dato],
    [m.fob, m.fob - m.offal, COL.riesgo],
    [m.fob - m.offal, m.margin, COL.riesgo],
    [0, m.margin, COL.marca],
  ]
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="historia__svg" focusable="false">
      <line x1={M.l} x2={W - M.r} y1={y(0)} y2={y(0)} stroke={COL.tinta} />
      {barras.map(([desde, hasta, color], i) => {
        const top = y(Math.max(desde, hasta))
        const alto = Math.max(2, Math.abs(y(desde) - y(hasta)))
        const valor = i === 0 ? m.fob : i === 1 ? -m.offal : i === 2 ? -m.costs : m.margin
        return (
          <g key={i}>
            <rect x={M.l + i * paso + paso * 0.18} width={paso * 0.64} y={top} height={alto} rx="4" fill={color} />
            <text
              x={M.l + i * paso + paso / 2}
              y={valor > 0 ? top - 6 : i === 1 ? top + alto / 2 + 4 : top + alto + 16}
              textAnchor="middle"
              className={i === 3 ? 'historia__valor' : i === 1 ? 'historia__eje historia__eje--dentro' : 'historia__eje'}
            >
              {valor > 0 ? '' : '−'}
              {f.format(Math.abs(valor))}
            </text>
            <text x={M.l + i * paso + paso / 2} y={H - 4} textAnchor="middle" className="historia__eje">
              {t.waterfall[i]}
            </text>
          </g>
        )
      })}
      <text x={M.l} y={14} className="historia__eje">
        {t.ejes.usdKg}
      </text>
    </svg>
  )
}

/* ——— Paso 6: disparadores en semáforo (lista, no gráfico) ——— */
const ICONO = { cumplido: '✓', 'en camino': '◷', 'no cumplido': '✕' } as const
function Disparadores({ t, locale }: { t: TextosHistoria; locale: string }) {
  const f = nf(locale, 2)
  return (
    <ul className="historia__disparadores">
      {D.triggers.map((d) => {
        const estado = d.status as keyof typeof ICONO
        return (
          <li key={d.code} className={`historia__disp historia__disp--${estado.replace(' ', '-')}`}>
            <span className="historia__disp-icono">{ICONO[estado]}</span>
            <span>
              <strong>{t.disparadores[d.code as keyof TextosHistoria['disparadores']]}</strong>
              {d.current !== null && d.threshold !== null && (
                <span className="historia__disp-cifras">
                  {t.hoy} {f.format(d.current)} · {t.umbral} {f.format(d.threshold)} USD/kg
                </span>
              )}
            </span>
            <span className="historia__disp-estado">{t.estados[estado]}</span>
          </li>
        )
      })}
    </ul>
  )
}

function Figura({ paso, t, locale }: { paso: number; t: TextosHistoria; locale: string }) {
  switch (paso) {
    case 0:
      return <Participacion foco="ventana" t={t} locale={locale} />
    case 1:
      return <Participacion foco="cierre" t={t} locale={locale} />
    case 2:
      return <Mercado t={t} locale={locale} />
    case 3:
      return <Acceso t={t} />
    case 4:
      return <Margen t={t} locale={locale} />
    default:
      return <Disparadores t={t} locale={locale} />
  }
}

export default function HistoriaCerdo({ locale, textos }: { locale: 'es' | 'en'; textos: TextosHistoria }) {
  const [activo, setActivo] = useState(0)
  const pasos = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) if (e.isIntersecting) setActivo(Number((e.target as HTMLElement).dataset.paso))
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    pasos.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className="historia" data-historia>
      <div className="historia__fija" aria-hidden="true">
        <div className="tarjeta-base historia__lienzo" data-paso-activo={activo}>
          <Figura paso={activo} t={textos} locale={locale} />
        </div>
      </div>
      <ol className="historia__pasos">
        {textos.pasos.map((p, i) => (
          <li
            key={i}
            data-paso={i}
            ref={(el) => {
              pasos.current[i] = el
            }}
            className={`historia__paso${activo === i ? ' historia__paso--activo' : ''}`}
          >
            <p className="historia__num">{String(i + 1).padStart(2, '0')}</p>
            <h3>{p.titulo}</h3>
            <p>{p.texto}</p>
            <p className="sr-only">{p.descripcion}</p>
            <div className="tarjeta-base historia__lienzo historia__lienzo--movil" aria-hidden="true">
              <Figura paso={i} t={textos} locale={locale} />
            </div>
          </li>
        ))}
      </ol>
      <p className="nota historia__fuente">{textos.fuente}</p>
    </div>
  )
}
