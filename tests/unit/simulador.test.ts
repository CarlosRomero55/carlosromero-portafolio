import { describe, expect, it } from 'vitest'
import { impactoChina } from '@/components/SimuladorChina'

describe('simulador China 2024', () => {
  it('China −10 % de precio → −314 M USD y −4,5 % (igual que el dashboard)', () => {
    const r = impactoChina(-10, 0)
    expect(Math.round(r.delta)).toBe(-314)
    expect(r.pct.toFixed(1)).toBe('-4.5')
  })
  it('China −20 % de precio → −627 M USD (−9,0 %), como en insights.md', () => {
    const r = impactoChina(-20, 0)
    expect(Math.round(r.delta)).toBe(-627)
    expect(r.pct.toFixed(1)).toBe('-9.0')
  })
  it('sin cambios no hay impacto', () => {
    expect(impactoChina(0, 0).delta).toBe(0)
  })
})
