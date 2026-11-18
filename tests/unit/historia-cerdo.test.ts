import { describe, expect, it } from 'vitest'
import { cifrasHistoria, DATOS_CERDO } from '@/lib/historia-cerdo'

describe('historia Pork to China (datos reales de pork_gold)', () => {
  const c = cifrasHistoria()

  it('el margen por kilo es precio en China − víscera − costos', () => {
    expect(c.fob - c.offal - c.costs).toBeCloseTo(c.margin, 1)
    expect(c.margin).toBeLessThan(0)
  })

  it('lo que Ecuador podría colocar es una fracción mínima del mercado chino', () => {
    expect(c.ecuadorMin).toBeLessThanOrEqual(c.ecuadorMax)
    expect(c.pctEcuador).toBeGreaterThan(0)
    expect(c.pctEcuador).toBeLessThan(1)
    expect(c.anioMercado).toBeGreaterThanOrEqual(2025)
  })

  it('trae la serie mensual, los cortes y los cinco disparadores', () => {
    const meses = DATOS_CERDO.us_share_value_pct.map(([m]) => m)
    for (const corte of Object.values(DATOS_CERDO.cuts)) expect(meses).toContain(corte)
    expect(DATOS_CERDO.triggers.map((t) => t.code)).toEqual(['D1', 'D2', 'D3', 'D4', 'D5'])
    for (const t of DATOS_CERDO.triggers) expect(['cumplido', 'en camino', 'no cumplido']).toContain(t.status)
  })
})
