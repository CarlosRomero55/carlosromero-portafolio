/**
 * Datos de la historia "Pork to China" (scrollytelling, paso 16.3 del proyecto).
 * Todas las cifras salen de los documentos generados por el pipeline del repositorio
 * CarlosRomero55/pork-to-china (corrida del 17-nov-2026). Cada paso cita su archivo.
 * No se calcula nada nuevo aquí: solo se copian las cifras para dibujarlas.
 */

export type Idioma = 'es' | 'en'
type Texto = Record<Idioma, string>

/** 1 · Cambio de participación en las vísceras que compra China (pp), 12 meses antes vs después de mar-2025. */
export const DESVIO: { pais: Texto; pp: number }[] = [
  { pais: { es: 'España', en: 'Spain' }, pp: 2.3 },
  { pais: { es: 'Reino Unido', en: 'United Kingdom' }, pp: 2.1 },
  { pais: { es: 'Dinamarca', en: 'Denmark' }, pp: 1.7 },
  { pais: { es: 'Canadá', en: 'Canada' }, pp: 0.5 },
  { pais: { es: 'Chile', en: 'Chile' }, pp: 0.3 },
  { pais: { es: 'Brasil', en: 'Brazil' }, pp: 0.2 },
  { pais: { es: 'Irlanda', en: 'Ireland' }, pp: -0.1 },
  { pais: { es: 'Países Bajos', en: 'Netherlands' }, pp: -0.4 },
  { pais: { es: 'Francia', en: 'France' }, pp: -0.8 },
  { pais: { es: 'EE. UU.', en: 'United States' }, pp: -5.9 },
]

/** 2 · Serie de tiempo interrumpida: saltos de la participación de EE. UU. (pp) con IC 95 %. */
export const SALTOS: { evento: Texto; valor: number; bajo: number; alto: number }[] = [
  { evento: { es: 'Abr 2018 · represalias', en: 'Apr 2018 · retaliation' }, valor: -9.6, bajo: -17.6, alto: -1.5 },
  { evento: { es: 'Feb 2020 · Fase Uno y exclusiones', en: 'Feb 2020 · Phase One and exclusions' }, valor: 10.2, bajo: 4.3, alto: 16.1 },
]

/** 3 · Costo puesto en China de las vísceras congeladas (020649), USD/kg. */
export const LANDED: { pais: Texto; min: number; max: number; acceso: boolean; ecuador?: boolean }[] = [
  { pais: { es: 'Chile', en: 'Chile' }, min: 1.79, max: 1.79, acceso: true },
  { pais: { es: 'Ecuador (acuerdo)', en: 'Ecuador (FTA)' }, min: 1.96, max: 1.96, acceso: false, ecuador: true },
  { pais: { es: 'Ecuador (NMF)', en: 'Ecuador (MFN)' }, min: 2.0, max: 2.0, acceso: false, ecuador: true },
  { pais: { es: 'Canadá', en: 'Canada' }, min: 2.26, max: 2.26, acceso: true },
  { pais: { es: 'España', en: 'Spain' }, min: 2.39, max: 2.69, acceso: true },
  { pais: { es: 'Dinamarca', en: 'Denmark' }, min: 2.47, max: 2.79, acceso: true },
  { pais: { es: 'EE. UU.', en: 'United States' }, min: 3.02, max: 3.02, acceso: true },
  { pais: { es: 'Brasil', en: 'Brazil' }, min: 3.54, max: 3.54, acceso: true },
]

/** 4 · Margen por kilo: lo que paga China menos lo que cuesta llevarla (USD/kg). */
export const MARGEN = { fob: 1.47, viscera: 1.38, costos: 0.25, margen: -0.16 }

/** 5 · VAN al 12 % por escenario (millones de USD). Filas: caso comercial × autosuficiencia china. */
export const CERTIFICACION: Texto[] = [
  { es: 'Año 2', en: 'Year 2' },
  { es: 'Año 4', en: 'Year 4' },
  { es: 'Año 6', en: 'Year 6' },
  { es: 'Nunca', en: 'Never' },
]
export const VAN: { fila: Texto; valores: number[] }[] = [
  { fila: { es: 'A · se cierra · China autoabastece', en: 'A · closes · China self-supplies' }, valores: [-1.62, -1.26, -0.99, -0.56] },
  { fila: { es: 'A · se cierra · China importa más', en: 'A · closes · China imports more' }, valores: [-1.79, -1.4, -1.08, -0.56] },
  { fila: { es: 'B · statu quo · China autoabastece', en: 'B · status quo · China self-supplies' }, valores: [-1.87, -1.42, -1.07, -0.56] },
  { fila: { es: 'B · statu quo · China importa más', en: 'B · status quo · China imports more' }, valores: [-2.1, -1.59, -1.18, -0.56] },
  { fila: { es: 'C · se abre · China autoabastece', en: 'C · opens · China self-supplies' }, valores: [-2.18, -1.63, -1.19, -0.56] },
  { fila: { es: 'C · se abre · China importa más', en: 'C · opens · China imports more' }, valores: [-2.19, -1.63, -1.19, -0.56] },
]

/** 6 · Tornado: VAN (M USD) con el mínimo y el máximo de cada supuesto, escenario B-up-4 (base −1,42). */
export const TORNADO_BASE = -1.42
export const TORNADO: { supuesto: Texto; conMin: number; conMax: number }[] = [
  { supuesto: { es: 'Valor local de la víscera', en: 'Local offal value' }, conMin: 0.37, conMax: -9.42 },
  { supuesto: { es: 'Precio FOB de exportación', en: 'Export FOB price' }, conMin: -2.38, conMax: 0.46 },
  { supuesto: { es: 'Costo de proceso', en: 'Processing cost' }, conMin: -0.93, conMax: -1.91 },
  { supuesto: { es: 'Costo de congelación', en: 'Freezing cost' }, conMin: -1.22, conMax: -1.71 },
  { supuesto: { es: 'Logística de exportación', en: 'Export logistics' }, conMin: -1.22, conMax: -1.61 },
]

/** Disparadores de la recomendación (docs/triggers.md). */
export const DISPARADORES: { codigo: string; texto: Texto; hoy: Texto; cumplido: 'no' | 'en-camino' }[] = [
  {
    codigo: 'D1',
    texto: { es: 'Víscera en planta a 1,14 USD/kg o menos', en: 'Offal bought at the plant for 1.14 USD/kg or less' },
    hoy: { es: 'Hoy: 1,38 USD/kg', en: 'Today: 1.38 USD/kg' },
    cumplido: 'no',
  },
  {
    codigo: 'D2',
    texto: { es: 'FOB de referencia en China de 1,84 USD/kg o más', en: 'Reference FOB in China of 1.84 USD/kg or more' },
    hoy: { es: 'Hoy: 1,47 USD/kg', en: 'Today: 1.47 USD/kg' },
    cumplido: 'no',
  },
  {
    codigo: 'D3',
    texto: { es: 'Zona continental libre de peste porcina clásica (OMSA)', en: 'Continental zone free of classical swine fever (WOAH)' },
    hoy: { es: 'Hoy: solo Galápagos', en: 'Today: only the Galápagos' },
    cumplido: 'no',
  },
  {
    codigo: 'D4',
    texto: { es: 'Protocolo sanitario firmado con la aduana china (GACC)', en: 'Sanitary protocol signed with China’s customs (GACC)' },
    hoy: { es: 'Hoy: sin protocolo ni proceso público', en: 'Today: no protocol or public process' },
    cumplido: 'no',
  },
  {
    codigo: 'D5',
    texto: { es: 'Libre de fiebre aftosa sin vacunación', en: 'Free of foot-and-mouth disease without vaccination' },
    hoy: { es: 'En camino: meta 2027', en: 'On track: 2027 target' },
    cumplido: 'en-camino',
  },
]

/** Textos de cada paso de la historia. */
export const PASOS: { titulo: Texto; texto: Texto; fuente: Texto }[] = [
  {
    titulo: { es: 'La ventana existe', en: 'The window is real' },
    texto: {
      es: 'Tras los aranceles de China de marzo de 2025, EE. UU. perdió 5,9 puntos de participación en las vísceras de cerdo que compra China (de 28,7 % a 22,8 % de las toneladas). Ese espacio no lo llenó un recién llegado: lo tomaron España, Reino Unido y Dinamarca.',
      en: 'After China’s March 2025 tariffs, the US lost 5.9 points of share in the pork offal China buys (from 28.7% to 22.8% of tonnes). The gap was not filled by a newcomer: Spain, the UK and Denmark took it.',
    },
    fuente: {
      es: 'UN Comtrade, datos espejo de los 12 proveedores; 12 meses antes vs. después de mar-2025 (docs/queries.md, q01).',
      en: 'UN Comtrade, mirror data from the 12 suppliers; 12 months before vs. after Mar 2025 (docs/queries.md, q01).',
    },
  },
  {
    titulo: { es: 'Pero puede cerrarse', en: 'But it can close' },
    texto: {
      es: 'No es la primera vez. En abril de 2018 las represalias le quitaron a EE. UU. 9,6 puntos; en febrero de 2020, con la Fase Uno y las exclusiones, recuperó 10,2. Una ventana abierta por aranceles se cierra cuando los aranceles se negocian.',
      en: 'It has happened before. In April 2018 retaliation cost the US 9.6 points; in February 2020, with Phase One and the exclusions, it won back 10.2. A window opened by tariffs closes when tariffs are negotiated.',
    },
    fuente: {
      es: 'Serie de tiempo interrumpida, 138 meses, errores de Newey-West; barras = intervalo de confianza del 95 % (docs/its.md).',
      en: 'Interrupted time series, 138 months, Newey-West errors; bars = 95% confidence interval (docs/its.md).',
    },
  },
  {
    titulo: { es: 'Y Ecuador ni siquiera puede entrar', en: 'And Ecuador cannot even get in' },
    texto: {
      es: 'Puesto en China, el kilo de vísceras ecuatorianas costaría unos 1,96 USD: segundo, detrás de Chile. Pero es un precio teórico: Ecuador no tiene permiso sanitario. La OMSA solo reconoce a Galápagos como libre de peste porcina clásica, y Chile, Costa Rica y Brasil tardaron unos 7 años desde el protocolo.',
      en: 'Landed in China, a kilo of Ecuadorian offal would cost about 1.96 USD: second, behind Chile. But that price is theoretical: Ecuador has no sanitary access. The WOAH recognizes only the Galápagos as free of classical swine fever, and Chile, Costa Rica and Brazil took about 7 years from the protocol.',
    },
    fuente: {
      es: 'FOB real 2025 (espejo) + flete, seguro y arancel vigente (docs/landed_cost.md); OMSA y benchmark de acceso (supuestos #44–#46).',
      en: '2025 actual FOB (mirror) + freight, insurance and current tariff (docs/landed_cost.md); WOAH and access benchmark (assumptions #44–#46).',
    },
  },
  {
    titulo: { es: 'Cada kilo pierde dinero', en: 'Every kilo loses money' },
    texto: {
      es: 'China paga 1,47 USD por kilo. En Ecuador esa víscera ya vale 1,38, y procesarla, congelarla y llevarla al puerto cuesta 0,25 más. Resultado: −0,16 USD por kilo. Con margen negativo, vender más volumen solo agranda la pérdida.',
      en: 'China pays 1.47 USD per kilo. In Ecuador that offal is already worth 1.38, and processing, freezing and getting it to port costs 0.25 more. Result: −0.16 USD per kilo. With a negative margin, more volume only means a bigger loss.',
    },
    fuente: {
      es: 'FOB de Chile 020649, 12 meses a sep-2026 (UN Comtrade); precios de productor SIPA/MAG (docs/recommendation.md).',
      en: 'Chile FOB 020649, 12 months to Sep 2026 (UN Comtrade); SIPA/MAG producer prices (docs/recommendation.md).',
    },
  },
  {
    titulo: { es: 'Ningún escenario gana', en: 'No scenario wins' },
    texto: {
      es: 'Combinamos 3 futuros de la guerra comercial, 2 caminos de la autosuficiencia china y 4 años posibles de certificación: 24 escenarios. El valor actual neto es negativo en los 24. Si nunca se certifica, se pierde solo la inversión inicial; certificarse antes pierde más, porque se exporta más con margen negativo.',
      en: 'We combined 3 trade-war futures, 2 paths for Chinese self-sufficiency and 4 possible certification years: 24 scenarios. Net present value is negative in all 24. If certification never comes, only the initial investment is lost; certifying earlier loses more, because more is exported at a negative margin.',
    },
    fuente: {
      es: 'Modelo de flujo de caja, tasa de descuento 12 %, año 0 = 2026 (docs/finance.md). Monte Carlo de 10.000 sorteos: probabilidad de VAN positivo entre 1 % y 11 % (docs/monte_carlo.md).',
      en: 'Cash-flow model, 12% discount rate, year 0 = 2026 (docs/finance.md). 10,000-draw Monte Carlo: probability of a positive NPV between 1% and 11% (docs/monte_carlo.md).',
    },
  },
  {
    titulo: { es: 'Lo que decide todo', en: 'What decides everything' },
    texto: {
      es: 'De 12 supuestos, uno pesa más que todos los demás juntos: cuánto vale la víscera en Ecuador. Con su valor mínimo, el proyecto gana; con el máximo, pierde 9,4 millones. Por eso la primera acción es barata: preguntarle el precio real a 2 o 3 camales.',
      en: 'Out of 12 assumptions, one outweighs all the others combined: what the offal is worth in Ecuador. At its minimum value the project makes money; at its maximum it loses 9.4 million. That is why the first action is cheap: ask 2 or 3 slaughterhouses for the real price.',
    },
    fuente: {
      es: 'Análisis de sensibilidad (tornado) del escenario B-up-4, VAN base −1,42 M USD (docs/monte_carlo.md).',
      en: 'Sensitivity analysis (tornado) for scenario B-up-4, base NPV −1.42 M USD (docs/monte_carlo.md).',
    },
  },
]

export const CIERRE = {
  titulo: { es: 'La recomendación: todavía no', en: 'The recommendation: not yet' },
  texto: {
    es: 'No invertir hoy. Revisar la decisión cuando se cumpla una condición económica y las dos de acceso. El tablero recalcula estos disparadores en cada corrida del pipeline.',
    en: 'Do not invest today. Revisit the decision when one economic condition and both access conditions are met. The dashboard recomputes these triggers on every pipeline run.',
  },
  nota: {
    es: 'AgroPorc Ecuador es una empresa ficticia; todos los datos son públicos. Es un análisis de portafolio, no asesoría de inversión.',
    en: 'AgroPorc Ecuador is a fictitious company; all data is public. This is a portfolio analysis, not investment advice.',
  },
}
