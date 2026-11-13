'use client'

import { useId, useState } from 'react'

/**
 * Simulador del caso Shrimp: impacto en el valor exportado si China cambia
 * precio o volumen. Valores 2024 en millones de USD (datos del proyecto, BCE + UN Comtrade).
 * El total incluye 301 M USD sin desglose por región.
 */
const REGIONES_2024: [string, string, number][] = [
  ['china', 'China', 3136],
  ['europa', 'Europa', 1485],
  ['eeuu', 'EE. UU.', 1439],
  ['asia', 'Resto de Asia', 333],
  ['america', 'Resto de América', 251],
  ['africa', 'África', 43],
  ['oceania', 'Oceanía', 4],
]
const NOMBRES_EN: Record<string, string> = {
  china: 'China',
  europa: 'Europe',
  eeuu: 'United States',
  asia: 'Rest of Asia',
  america: 'Rest of the Americas',
  africa: 'Africa',
  oceania: 'Oceania',
}
const TOTAL_2024 = 6992
const CHINA_2024 = 3136
const ESCALA = 3600

export type TextosSimulador = Record<
  'precio' | 'volumen' | 'real' | 'escenario' | 'impacto' | 'pct' | 'nota' | 'leyendaReal' | 'leyendaEsc' | 'regiones',
  string
>

export function impactoChina(precioPct: number, volumenPct: number) {
  const china = CHINA_2024 * (1 + precioPct / 100) * (1 + volumenPct / 100)
  const delta = china - CHINA_2024
  return { china, delta, total: TOTAL_2024 + delta, pct: (delta / TOTAL_2024) * 100 }
}

export default function SimuladorChina({ locale, textos }: { locale: 'es' | 'en'; textos: TextosSimulador }) {
  const [precio, setPrecio] = useState(-10)
  const [volumen, setVolumen] = useState(0)
  const idP = useId()
  const idV = useId()
  const nf = new Intl.NumberFormat(locale === 'es' ? 'es-EC' : 'en-US', { maximumFractionDigits: 0 })
  const pf = new Intl.NumberFormat(locale === 'es' ? 'es-EC' : 'en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  const firma = (n: number) => (n > 0 ? '+' : n < 0 ? '−' : '')
  const { china, delta, total, pct } = impactoChina(precio, volumen)
  const riesgo = delta < 0 ? 'riesgo' : undefined

  return (
    <div className="tarjeta-base sim">
      <div className="sim__control">
        <label htmlFor={idP}>
          {textos.precio} <output htmlFor={idP}>{firma(precio)}{Math.abs(precio)} %</output>
        </label>
        <input id={idP} type="range" min={-30} max={30} step={1} value={precio} onChange={(e) => setPrecio(Number(e.target.value))} />
        <label htmlFor={idV}>
          {textos.volumen} <output htmlFor={idV}>{firma(volumen)}{Math.abs(volumen)} %</output>
        </label>
        <input id={idV} type="range" min={-30} max={30} step={1} value={volumen} onChange={(e) => setVolumen(Number(e.target.value))} />
        <dl className="sim__res" aria-live="polite">
          <div>
            <dt>{textos.real}</dt>
            <dd>{nf.format(TOTAL_2024)} M</dd>
          </div>
          <div>
            <dt>{textos.escenario}</dt>
            <dd>{nf.format(total)} M</dd>
          </div>
          <div>
            <dt>{textos.impacto}</dt>
            <dd className={riesgo} data-impacto>
              {firma(Math.round(delta))}
              {nf.format(Math.abs(delta))} M
            </dd>
          </div>
          <div>
            <dt>{textos.pct}</dt>
            <dd className={riesgo}>
              {firma(Math.round(pct * 10))}
              {pf.format(Math.abs(pct))} %
            </dd>
          </div>
        </dl>
      </div>
      <div>
        <p className="sr-only">{textos.regiones}</p>
        <ul className="sim__barras">
          {REGIONES_2024.map(([clave, nombre, valor]) => {
            const esc = clave === 'china' ? china : valor
            return (
              <li className="sim__fila" key={clave}>
                <span>{locale === 'es' ? nombre : NOMBRES_EN[clave]}</span>
                <span className="sim__pista" aria-hidden="true">
                  <span className="sim__real" style={{ width: `${(valor / ESCALA) * 100}%` }} />
                  <span className="sim__esc" style={{ width: `${(esc / ESCALA) * 100}%` }} />
                </span>
                <span className="sim__valor">{nf.format(esc)} M</span>
              </li>
            )
          })}
        </ul>
        <p className="sim__leyenda" aria-hidden="true">
          <span>{textos.leyendaReal}</span>
          <span>{textos.leyendaEsc}</span>
        </p>
        <p className="nota">{textos.nota}</p>
      </div>
    </div>
  )
}
