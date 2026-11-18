import datos from '../../data/real/pork-historia.json'

/**
 * Datos REALES del caso Pork to China (exportados de pork_gold con tools/export_web.py del repositorio
 * pork-to-china). Módulo compartido entre la página (servidor) y la historia por pasos (cliente).
 */
export type DatosCerdo = typeof datos
export const DATOS_CERDO: DatosCerdo = datos

/** Cifras que usan los textos de cada paso. */
export function cifrasHistoria(d: DatosCerdo = DATOS_CERDO) {
  const anios = d.china_offal_imports_t.filter(([, , m]) => m === 12)
  const ultimo = anios[anios.length - 1]
  return {
    antes: d.us_offal_tonnes_pct.before,
    despues: d.us_offal_tonnes_pct.after,
    p18: Math.abs(d.its_pp['2018']),
    p20: d.its_pp['2020'],
    ultimos: d.us_share_last3,
    anioMercado: ultimo[0],
    toneladas: ultimo[1],
    ecuadorMin: d.ecuador_reach_t.min,
    ecuadorMax: d.ecuador_reach_t.max,
    pctEcuador: (100 * d.ecuador_reach_t.max) / ultimo[1],
    ...d.margin_usd_kg,
    vanNeg: d.npv_negative.n,
    escenarios: d.npv_negative.of,
    fecha: d.as_of,
  }
}
