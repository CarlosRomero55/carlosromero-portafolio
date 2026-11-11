/**
 * Genera datos SIMULADOS con semilla fija (resultado reproducible).
 * No representan cifras reales de exportación. Uso: pnpm data:synthetic
 */
import { writeFileSync } from 'node:fs'
import path from 'node:path'

const SEMILLA = 20261111

function mulberry32(a: number) {
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const azar = mulberry32(SEMILLA)
const puntos: { mes: string; valor: number }[] = []
let base = 100
for (let i = 0; i < 24; i++) {
  const anio = 2024 + Math.floor(i / 12)
  const mes = (i % 12) + 1
  const estacional = 1 + 0.12 * Math.sin(((mes - 3) / 12) * 2 * Math.PI)
  base *= 1 + (azar() - 0.45) * 0.06
  puntos.push({ mes: `${anio}-${String(mes).padStart(2, '0')}`, valor: Math.round(base * estacional * 10) / 10 })
}

const salida = {
  simulado: true,
  descripcion: 'Índice mensual SIMULADO de volumen exportado (base 100). No son cifras reales.',
  semilla: SEMILLA,
  unidad: 'índice',
  puntos,
}
const destino = path.resolve('data/synthetic/camaron-exportaciones.json')
writeFileSync(destino, JSON.stringify(salida, null, 2) + '\n')
console.log(`OK → ${destino} (${puntos.length} puntos)`)
