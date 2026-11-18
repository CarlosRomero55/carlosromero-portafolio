/**
 * Los 6 gráficos de la historia "Pork to China", en SVG dibujado en el servidor (sin librerías).
 * Un solo eje por gráfico, etiquetas directas, colores de los tokens del sitio.
 * Los SVG son decorativos (aria-hidden): cada paso trae su tabla de datos para lectores de pantalla.
 */
import { CERTIFICACION, DESVIO, LANDED, MARGEN, SALTOS, TORNADO, TORNADO_BASE, VAN, type Idioma } from './datos'

const W = 440
const num = (n: number, locale: Idioma, dec = 1, signo = false) =>
  (signo && n > 0 ? '+' : '') +
  new Intl.NumberFormat(locale === 'es' ? 'es-EC' : 'en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(n).replace('-', '−')

/** Escala lineal simple. */
const escala = (d0: number, d1: number, r0: number, r1: number) => (v: number) => r0 + ((v - d0) / (d1 - d0)) * (r1 - r0)

function Marco({ alto, children }: { alto: number; children: React.ReactNode }) {
  return (
    <svg className="hp-svg" viewBox={`0 0 ${W} ${alto}`} aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}

/** 1 · Barras divergentes: quién ganó y quién perdió participación. */
export function GraficoDesvio({ locale }: { locale: Idioma }) {
  const fila = 30
  const alto = DESVIO.length * fila + 40
  const x = escala(-6.5, 3, 112, W - 44)
  return (
    <Marco alto={alto}>
      <line x1={x(0)} x2={x(0)} y1={8} y2={alto - 24} className="hp-eje" />
      {DESVIO.map((d, i) => {
        const y = 14 + i * fila
        const x0 = Math.min(x(0), x(d.pp))
        const ancho = Math.max(2, Math.abs(x(d.pp) - x(0)))
        const clase = d.pp < -3 ? 'hp-riesgo' : d.pp > 0 ? 'hp-gana' : 'hp-neutro'
        return (
          <g key={d.pais.es}>
            <text x={104} y={y + 15} textAnchor="end" className="hp-etq">
              {d.pais[locale]}
            </text>
            <rect x={x0} y={y + 2} width={ancho} height={18} rx={3} className={clase} />
            {/* Barras largas negativas: el valor va dentro para no chocar con el nombre. */}
            <text
              x={d.pp < 0 ? (ancho > 60 ? x0 + 6 : x0 - 6) : x0 + ancho + 6}
              y={y + 16}
              textAnchor={d.pp < 0 && ancho <= 60 ? 'end' : 'start'}
              className={d.pp < 0 && ancho > 60 ? 'hp-valor hp-valor--dentro' : 'hp-valor'}
            >
              {num(d.pp, locale, 1, true)}
            </text>
          </g>
        )
      })}
      <text x={x(0)} y={alto - 6} textAnchor="middle" className="hp-nota">
        {locale === 'es' ? 'puntos de participación (toneladas)' : 'share points (tonnes)'}
      </text>
    </Marco>
  )
}

/** 2 · Saltos estimados con su intervalo de confianza. */
export function GraficoSaltos({ locale }: { locale: Idioma }) {
  const alto = 240
  const x = escala(-20, 20, 24, W - 24)
  return (
    <Marco alto={alto}>
      <line x1={x(0)} x2={x(0)} y1={10} y2={alto - 30} className="hp-eje" />
      {SALTOS.map((s, i) => {
        const y = 60 + i * 90
        const clase = s.valor < 0 ? 'hp-riesgo' : 'hp-gana'
        return (
          <g key={s.evento.es}>
            <text x={8} y={y - 24} className="hp-etq">
              {s.evento[locale]}
            </text>
            <line x1={x(s.bajo)} x2={x(s.alto)} y1={y} y2={y} className={`hp-ic ${clase}`} />
            <line x1={x(s.bajo)} x2={x(s.bajo)} y1={y - 7} y2={y + 7} className={`hp-ic ${clase}`} />
            <line x1={x(s.alto)} x2={x(s.alto)} y1={y - 7} y2={y + 7} className={`hp-ic ${clase}`} />
            <circle cx={x(s.valor)} cy={y} r={9} className={clase} />
            <text x={x(s.valor)} y={y + 30} textAnchor="middle" className="hp-valor hp-valor--grande">
              {num(s.valor, locale, 1, true)} pp
            </text>
          </g>
        )
      })}
      <text x={x(-20)} y={alto - 8} className="hp-nota">
        {locale === 'es' ? '← pierde EE. UU.' : '← US loses'}
      </text>
      <text x={x(20)} y={alto - 8} textAnchor="end" className="hp-nota">
        {locale === 'es' ? 'recupera EE. UU. →' : 'US recovers →'}
      </text>
    </Marco>
  )
}

/** 3 · Costo puesto en China por proveedor; Ecuador en contorno porque no tiene acceso. */
export function GraficoLanded({ locale }: { locale: Idioma }) {
  const fila = 32
  const alto = LANDED.length * fila + 44
  const x = escala(0, 3.8, 150, W - 64)
  return (
    <Marco alto={alto}>
      {LANDED.map((l, i) => {
        const y = 10 + i * fila
        const clase = l.ecuador ? 'hp-ecuador' : l.pais.es === 'Chile' ? 'hp-gana' : 'hp-neutro'
        return (
          <g key={l.pais.es}>
            <text x={142} y={y + 18} textAnchor="end" className={l.ecuador ? 'hp-etq hp-etq--fuerte' : 'hp-etq'}>
              {l.pais[locale]}
            </text>
            <rect x={x(0)} y={y + 4} width={x(l.min) - x(0)} height={18} rx={3} className={clase} />
            {l.max > l.min && <rect x={x(l.min)} y={y + 4} width={x(l.max) - x(l.min)} height={18} rx={3} className="hp-rango" />}
            <text x={x(l.max) + 6} y={y + 18} className="hp-valor">
              {l.max > l.min ? `${num(l.min, locale, 2)}–${num(l.max, locale, 2)}` : num(l.min, locale, 2)}
            </text>
          </g>
        )
      })}
      <text x={8} y={alto - 22} className="hp-nota">
        {locale === 'es' ? 'USD por kg puesto en China' : 'USD per kg landed in China'}
      </text>
      <text x={8} y={alto - 6} className="hp-nota">
        {locale === 'es' ? 'contorno punteado = sin permiso sanitario' : 'dashed outline = no sanitary access'}
      </text>
    </Marco>
  )
}

/** 4 · Cascada del margen por kilo. */
export function GraficoMargen({ locale }: { locale: Idioma }) {
  const alto = 300
  const y = escala(-0.3, 1.6, alto - 64, 24)
  const pasos = [
    { etq: locale === 'es' ? ['China', 'paga'] : ['China', 'pays'], desde: 0, hasta: MARGEN.fob, clase: 'hp-gana' },
    { etq: locale === 'es' ? ['Víscera en', 'Ecuador'] : ['Offal in', 'Ecuador'], desde: MARGEN.fob, hasta: MARGEN.fob - MARGEN.viscera, clase: 'hp-neutro' },
    { etq: locale === 'es' ? ['Proceso,', 'frío y puerto'] : ['Processing,', 'cold, port'], desde: MARGEN.fob - MARGEN.viscera, hasta: MARGEN.margen, clase: 'hp-neutro' },
    { etq: locale === 'es' ? ['Margen', 'por kilo'] : ['Margin', 'per kilo'], desde: 0, hasta: MARGEN.margen, clase: 'hp-riesgo' },
  ]
  const ancho = 64
  const paso = (W - 16) / pasos.length
  const valores = [MARGEN.fob, -MARGEN.viscera, -MARGEN.costos, MARGEN.margen]
  return (
    <Marco alto={alto}>
      <line x1={8} x2={W - 8} y1={y(0)} y2={y(0)} className="hp-eje" />
      {pasos.map((p, i) => {
        const cx = 8 + paso * i + paso / 2
        const top = y(Math.max(p.desde, p.hasta))
        const h = Math.max(2, Math.abs(y(p.desde) - y(p.hasta)))
        return (
          <g key={p.etq[0]}>
            <rect x={cx - ancho / 2} y={top} width={ancho} height={h} rx={3} className={p.clase} />
            {i < pasos.length - 1 && (
              <line x1={cx + ancho / 2} x2={cx + paso - ancho / 2} y1={y(p.hasta)} y2={y(p.hasta)} className="hp-guia" />
            )}
            <text x={cx} y={top - 8} textAnchor="middle" className={i === 3 ? 'hp-valor hp-valor--grande hp-txt-riesgo' : 'hp-valor'}>
              {num(valores[i], locale, 2, i === 0)}
            </text>
            <text x={cx} y={alto - 40} textAnchor="middle" className="hp-etq">
              <tspan x={cx}>{p.etq[0]}</tspan>
              <tspan x={cx} dy={16}>
                {p.etq[1]}
              </tspan>
            </text>
          </g>
        )
      })}
      <text x={8} y={alto - 4} className="hp-nota">
        {locale === 'es' ? 'USD por kg de víscera' : 'USD per kg of offal'}
      </text>
    </Marco>
  )
}

/** 5 · Mapa de calor del VAN de los 24 escenarios. */
export function GraficoVan({ locale }: { locale: Idioma }) {
  const izq = 150
  const celdaW = (W - izq - 4) / CERTIFICACION.length
  const celdaH = 44
  const alto = 30 + VAN.length * celdaH + 30
  // Intensidad del rojo según la pérdida (−0,5 a −2,2 M USD).
  const opacidad = (v: number) => 0.25 + ((Math.min(-v, 2.2) - 0.5) / 1.7) * 0.7
  return (
    <Marco alto={alto}>
      {CERTIFICACION.map((c, j) => (
        <text key={c.es} x={izq + celdaW * j + celdaW / 2} y={18} textAnchor="middle" className="hp-etq">
          {c[locale]}
        </text>
      ))}
      {VAN.map((f, i) => (
        <g key={f.fila.es}>
          {/* Etiqueta en dos líneas: caso comercial / autosuficiencia china. */}
          <text x={izq - 8} y={30 + i * celdaH + celdaH / 2 - 3} textAnchor="end" className="hp-etq hp-etq--chica">
            <tspan x={izq - 8}>{f.fila[locale].split(' · ').slice(0, 2).join(' · ')}</tspan>
            <tspan x={izq - 8} dy={15}>
              {f.fila[locale].split(' · ')[2]}
            </tspan>
          </text>
          {f.valores.map((v, j) => (
            <g key={j}>
              <rect
                x={izq + celdaW * j + 1}
                y={30 + i * celdaH + 1}
                width={celdaW - 2}
                height={celdaH - 2}
                rx={3}
                className="hp-riesgo"
                style={{ opacity: opacidad(v) }}
              />
              <text x={izq + celdaW * j + celdaW / 2} y={30 + i * celdaH + celdaH / 2 + 5} textAnchor="middle" className="hp-valor hp-valor--celda">
                {num(v, locale, 2)}
              </text>
            </g>
          ))}
        </g>
      ))}
      <text x={8} y={alto - 6} className="hp-nota">
        {locale === 'es' ? 'VAN al 12 %, millones de USD · columnas: año en que se certifica' : 'NPV at 12%, USD millions · columns: certification year'}
      </text>
    </Marco>
  )
}

/** 6 · Tornado de sensibilidad. */
export function GraficoTornado({ locale }: { locale: Idioma }) {
  const fila = 46
  const alto = TORNADO.length * fila + 50
  const x = escala(-10, 1, 150, W - 44)
  return (
    <Marco alto={alto}>
      <line x1={x(TORNADO_BASE)} x2={x(TORNADO_BASE)} y1={6} y2={alto - 34} className="hp-eje" />
      <line x1={x(0)} x2={x(0)} y1={6} y2={alto - 34} className="hp-guia" />
      <text x={x(0) + 4} y={alto - 22} className="hp-nota">
        {locale === 'es' ? 'VAN 0' : 'NPV 0'}
      </text>
      {TORNADO.map((t, i) => {
        const y = 12 + i * fila
        const a = Math.min(t.conMin, t.conMax)
        const b = Math.max(t.conMin, t.conMax)
        return (
          <g key={t.supuesto.es}>
            <text x={142} y={y + 9} textAnchor="end" className={i === 0 ? 'hp-etq hp-etq--fuerte' : 'hp-etq'}>
              <tspan x={142}>{t.supuesto[locale].split(' ').slice(0, 2).join(' ')}</tspan>
              <tspan x={142} dy={15}>
                {t.supuesto[locale].split(' ').slice(2).join(' ')}
              </tspan>
            </text>
            <rect x={x(a)} y={y + 3} width={Math.max(2, x(b) - x(a))} height={18} rx={3} className={i === 0 ? 'hp-riesgo' : 'hp-neutro'} />
            <text x={x(b) + 6} y={y + 16} className="hp-valor">
              {num(b, locale, 2, true)}
            </text>
            {i === 0 && (
              <text x={x(a) + 6} y={y + 16} className="hp-valor hp-valor--dentro">
                {num(a, locale, 2)}
              </text>
            )}
          </g>
        )
      })}
      <text x={x(TORNADO_BASE)} y={alto - 8} textAnchor="middle" className="hp-nota">
        {locale === 'es' ? `VAN base ${num(TORNADO_BASE, locale, 2)} M USD` : `Base NPV ${num(TORNADO_BASE, locale, 2)} M USD`}
      </text>
    </Marco>
  )
}

export const GRAFICOS = [GraficoDesvio, GraficoSaltos, GraficoLanded, GraficoMargen, GraficoVan, GraficoTornado]
export { num }
