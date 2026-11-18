/**
 * Contenido v9 (17 nov 2026): proyecto de datos "Pork to China" con su historia en 6 gráficos (paso 16.3).
 *
 * Fuente: README, docs/recommendation.md y docs/*.md del repositorio CarlosRomero55/pork-to-china (corrida 17-nov-2026).
 * Mismas reglas que v4: crea en español (publicado) solo si no existe, nunca pisa lo editado en el panel,
 * el inglés queda sin publicar salvo PUBLICAR_INGLES=true. Empresa ficticia (AgroPorc Ecuador), datos públicos.
 * Uso: pnpm contenido:v9
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { doc, p, ul } from './lexical'

type Rec = Record<string, unknown>

const PUBLICAR_INGLES = process.env.PUBLICAR_INGLES === 'true'
const SLUG = 'pork-to-china'
const REPO = 'https://github.com/CarlosRomero55/pork-to-china'

const vacio = (v: unknown) =>
  v === null || v === undefined || v === '' || (Array.isArray(v) && v.length === 0) ||
  (typeof v === 'object' && v !== null && 'root' in v && !/"text":"[^"]*\S/.test(JSON.stringify(v)))

const DEMO = 'https://pork-to-china-gge74hkshbuxj3q5ppakat.streamlit.app/'
const PDF = 'https://github.com/CarlosRomero55/pork-to-china/blob/main/docs/policy_brief.pdf'

async function main() {
  const payload = await getPayload({ config })
  const cambios: string[] = []

  // ——— Proyecto en español ———
  let proyecto = (
    await payload.find({ collection: 'proyectos', locale: 'es', where: { slug: { equals: SLUG } }, limit: 1, depth: 0 })
  ).docs[0] as unknown as Rec | undefined

  if (!proyecto) {
    proyecto = (await payload.create({
      collection: 'proyectos',
      locale: 'es',
      data: {
        publicado: true,
        orden: 2,
        destacado: true,
        titulo: 'Pork to China: ¿puede Ecuador aprovechar la guerra comercial?',
        slug: SLUG,
        area: 'ambos',
        titular: 'La guerra comercial abrió un espacio en las vísceras de cerdo que compra China. La respuesta: todavía no, y estas 4 condiciones lo cambiarían.',
        resumen: 'Estudio de entrada a mercado con datos públicos para una empresa ficticia: almacén en MySQL, pipeline probado, 24 escenarios, Monte Carlo y una recomendación con disparadores.',
        tecnologias: ['Python', 'MySQL', 'SQL', 'Streamlit', 'FastAPI', 'NumPy'],
        portadaRuta: '/proyectos/pork/recomendacion.webp',
        portadaAlt: 'Página de recomendación del tablero: «Recomendación: no invertir hoy», con los cinco disparadores (precio de la víscera, precio FOB, zona libre de peste porcina, protocolo con China y fiebre aftosa) y su estado actual.',
        portadaEtiqueta: 'Caso de datos',
        destacados: [
          { cifra: '24/24', texto: 'escenarios con valor actual neto negativo' },
          { cifra: '1–11 %', texto: 'probabilidad de ganar, aun con certificación (Monte Carlo)' },
          { cifra: '210', texto: 'pruebas automáticas en un pipeline de 15 etapas' },
        ],
        hallazgos: [
          { cifra: '−5,9 pp', texto: 'cayó EE. UU. en las vísceras que compra China tras los aranceles de 2025; el hueco lo llenó Europa', tono: 'normal' },
          { cifra: '−0,16', texto: 'USD de margen por kilo: China paga 1,47 y en Ecuador la víscera ya vale 1,38 más 0,25 de costos', tono: 'riesgo' },
          { cifra: '0', texto: 'zonas continentales de Ecuador libres de peste porcina clásica: hoy no hay permiso sanitario para entrar', tono: 'riesgo' },
          { cifra: '1,14', texto: 'USD/kg: precio de la víscera en planta al que el proyecto empieza a ganar (hoy 1,38)', tono: 'destacado' },
        ],
        ficha: {
          tipo: 'Estudio de entrada a mercado (análisis de datos)',
          periodo: 'Comercio 2015–2026 · decisión al 17-nov-2026',
          fuentesDatos: 'UN Comtrade (con datos espejo), USDA FAS, INEC, OMSA, Agrocalidad, SIPA/MAG',
          calidad: '12 reglas de calidad de datos · 53 supuestos con rango y fuente',
        },
        preguntaNegocio: 'China castigó con aranceles al cerdo de EE. UU. y de Europa. ¿Hay espacio real para que una empresa ecuatoriana exporte vísceras de cerdo a China, cuánto vale y qué le falta para entrar?',
        problema: doc(
          p('Una empresa porcícola ecuatoriana (ficticia: AgroPorc Ecuador) debe decidir si invierte en habilitarse para exportar vísceras congeladas a China. La guerra comercial parece una oportunidad, pero nadie ha medido cuánto espacio dejó de verdad, cuánto costaría llegar ni si el negocio deja dinero.'),
        ),
        datosLimpieza: doc(
          p('Todo sale de fuentes públicas. China reporta a UN Comtrade con retraso, así que sus importaciones se reconstruyen con lo que declaran sus 12 proveedores (datos espejo). Los aranceles se guardan con historial (SCD tipo 2) para saber cuál regía cada mes, y cada supuesto de costo tiene mínimo, base y máximo con su fuente.'),
          p('El almacén sigue el patrón Medallion en MySQL 8 (bronze crudo, silver limpio, gold en estrella) y un pipeline de 15 etapas valida 12 reglas de calidad antes de calcular nada.'),
        ),
        metodo: doc(
          p('Se combinaron métodos que responden preguntas distintas:'),
          ul([
            'Consultas SQL con funciones de ventana para medir quién ganó y quién perdió participación.',
            'Costo puesto en China por proveedor: precio FOB, flete, seguro y arancel vigente.',
            '24 escenarios: 3 futuros de la guerra comercial × 2 caminos de autosuficiencia china × 4 años de certificación.',
            'Flujo de caja con VAN, TIR y punto de equilibrio por escenario.',
            'Serie de tiempo interrumpida para separar el efecto de los aranceles de la tendencia.',
            'Monte Carlo de 10.000 sorteos y análisis de sensibilidad para ver qué supuesto pesa más.',
          ]),
        ),
        pasos: [
          { etiqueta: '01', titulo: 'Fuentes', texto: 'Comtrade, USDA, OMSA', color: 'ninguno' },
          { etiqueta: '02', titulo: 'Medallion', texto: 'bronze · silver · gold', color: 'ninguno' },
          { etiqueta: '03', titulo: 'Modelos', texto: 'escenarios, VAN, ITS', color: 'ninguno' },
          { etiqueta: '04', titulo: 'Riesgo', texto: 'Monte Carlo y tornado', color: 'ninguno' },
          { etiqueta: '05', titulo: 'Decisión', texto: 'disparadores medibles', color: 'ninguno' },
        ],
        resultado: doc(
          p('La recomendación es no invertir hoy: el valor actual neto es negativo en los 24 escenarios y Ecuador no tiene permiso sanitario para entrar. No es un «nunca»: el proyecto define cuándo revisar la decisión (una condición económica y las dos de acceso) y el tablero recalcula esos disparadores en cada corrida.'),
          p('Entregables: tablero de 9 páginas, API de solo lectura, recomendación de una página, pre-mortem y un policy brief de 2 páginas. AgroPorc Ecuador es una empresa ficticia; es un análisis de portafolio, no asesoría de inversión.'),
        ),
        aprendizajes: doc(
          p('Un resultado de «todavía no» también es un buen resultado si dice exactamente qué tendría que cambiar. Y el supuesto más incómodo —cuánto vale la víscera en Ecuador— es el que más pesa: se valida con dos o tres llamadas, no con más código.'),
        ),
        simulador: 'historia-pork',
        capturas: [
          {
            ruta: '/proyectos/pork/simulador.webp',
            alt: 'Simulador What-If del tablero: controles para el valor local de la víscera, precio FOB, tasa de descuento, capacidad e inversión, y una curva del VAN según el valor de la víscera.',
            titulo: 'Simulador What-If',
            leyenda: 'Mueve los supuestos y el modelo recalcula VAN, TIR y payback con las mismas funciones del pipeline.',
          },
          {
            ruta: '/proyectos/pork/precio.webp',
            alt: 'Página «El precio en destino»: barras apiladas con precio FOB, flete y seguro, y arancel de las vísceras congeladas por proveedor en China.',
            titulo: 'El precio en destino',
            leyenda: 'Costo puesto en China por proveedor, separado en FOB, flete y arancel; Ecuador aparece como «sin acceso».',
          },
          {
            ruta: '/proyectos/pork/mapa.webp',
            alt: 'Mapa sanitario: cerdos por provincia de Ecuador según INEC y estado sanitario nacional de peste porcina clásica y fiebre aftosa.',
            titulo: 'Mapa sanitario',
            leyenda: 'Dónde está el cerdo de Ecuador y por qué el freno no es provincial: la peste porcina clásica está en todo el continente.',
          },
        ],
        decisiones: [
          { titulo: 'Directorio', texto: 'No invertir hoy y revisar cuando se cumplan los disparadores, sin perder la opción.' },
          { titulo: 'Gremio y Estado', texto: 'Priorizar la zona libre de peste porcina clásica: sin ella no hay protocolo con China.' },
          { titulo: 'Compras', texto: 'Validar con 2 o 3 camales el precio real de la víscera, el supuesto que más mueve el resultado.' },
        ],
        enlaces: [{ texto: 'Policy brief (PDF, 2 páginas)', url: PDF }],
        demo: DEMO,
        repositorio: REPO,
        contieneDatosSimulados: false,
        seo: {
          titulo: 'Pork to China — estudio de entrada a mercado',
          descripcion: '¿Puede Ecuador exportar vísceras de cerdo a China por la guerra comercial? 24 escenarios, Monte Carlo y una recomendación con disparadores.',
        },
      } as never,
    })) as unknown as Rec
    cambios.push('Pork to China: creado y publicado en español')
  }

  // Tablero en línea (Streamlit Community Cloud): se agrega si el proyecto ya existía sin demo.
  if (!proyecto.demo) {
    await payload.update({ collection: 'proyectos', id: proyecto.id as number, locale: 'es', data: { demo: DEMO } as never })
    cambios.push('Pork to China: demo en línea agregada')
  }

  // ——— Proyecto en inglés ———
  const id = proyecto.id as number
  const es = (await payload.findByID({ collection: 'proyectos', id, locale: 'es', fallbackLocale: false, depth: 0 })) as unknown as Rec
  const en = (await payload.findByID({ collection: 'proyectos', id, locale: 'en', fallbackLocale: false, depth: 0 })) as unknown as Rec
  const d: Rec = {}
  const texto = (campo: string, valor: unknown) => {
    if (vacio(en[campo])) d[campo] = valor
  }
  const filas = (campo: string, clave: string, mapa: Record<string, Rec>) => {
    const filasEs = Array.isArray(es[campo]) ? (es[campo] as Rec[]) : []
    const filasEn = Array.isArray(en[campo]) ? (en[campo] as Rec[]) : []
    if (filasEs.length === 0) return
    let cambia = false
    const nuevas = filasEs.map((fila, i) => {
      const actual = filasEn[i] ?? {}
      const trad = mapa[String(fila[clave] ?? '')]
      if (!trad || !Object.keys(trad).some((k) => vacio(actual[k]))) return { ...actual, id: fila.id }
      cambia = true
      return { ...actual, ...trad, id: fila.id }
    })
    if (cambia) d[campo] = nuevas
  }

  texto('titulo', 'Pork to China: can Ecuador benefit from the trade war?')
  texto('slug', 'pork-to-china')
  texto('titular', 'The trade war opened a gap in the pork offal China buys. The answer: not yet, and these 4 conditions would change it.')
  texto('resumen', 'Market-entry study with public data for a fictitious company: MySQL warehouse, tested pipeline, 24 scenarios, Monte Carlo and a recommendation with triggers.')
  texto('portadaAlt', 'Dashboard recommendation page: “Recommendation: do not invest today”, with the five triggers (offal price, FOB price, swine-fever-free zone, protocol with China and foot-and-mouth disease) and their current status.')
  texto('portadaEtiqueta', 'Data case study')
  texto('preguntaNegocio', 'China hit US and European pork with tariffs. Is there real room for an Ecuadorian company to export pork offal to China, how much is it worth, and what is missing to get in?')
  texto('problema', doc(
    p('An Ecuadorian pork company (fictitious: AgroPorc Ecuador) must decide whether to invest in getting approved to export frozen offal to China. The trade war looks like an opportunity, but nobody had measured how much room it really left, what it would cost to get there, or whether the business makes money.'),
  ))
  texto('datosLimpieza', doc(
    p('Everything comes from public sources. China reports to UN Comtrade with a lag, so its imports are rebuilt from what its 12 suppliers declare (mirror data). Tariffs are stored with history (SCD type 2) to know which one applied each month, and every cost assumption has a minimum, base and maximum with its source.'),
    p('The warehouse follows the Medallion pattern on MySQL 8 (raw bronze, clean silver, star-schema gold), and a 15-stage pipeline checks 12 data-quality rules before computing anything.'),
  ))
  texto('metodo', doc(
    p('The study combines methods that answer different questions:'),
    ul([
      'SQL queries with window functions to measure who gained and who lost share.',
      'Landed cost in China per supplier: FOB price, freight, insurance and current tariff.',
      '24 scenarios: 3 trade-war futures × 2 paths for Chinese self-sufficiency × 4 certification years.',
      'Cash-flow model with NPV, IRR and break-even per scenario.',
      'Interrupted time series to separate the effect of tariffs from the trend.',
      '10,000-draw Monte Carlo and sensitivity analysis to see which assumption matters most.',
    ]),
  ))
  texto('resultado', doc(
    p('The recommendation is not to invest today: net present value is negative in all 24 scenarios and Ecuador has no sanitary access. It is not a “never”: the project defines when to revisit the decision (one economic condition and both access conditions), and the dashboard recomputes those triggers on every run.'),
    p('Deliverables: a 9-page dashboard, a read-only API, a one-page recommendation, a pre-mortem and a two-page policy brief. AgroPorc Ecuador is a fictitious company; this is a portfolio analysis, not investment advice.'),
  ))
  texto('aprendizajes', doc(
    p('A “not yet” is a good result too, as long as it says exactly what would have to change. And the most uncomfortable assumption — what the offal is worth in Ecuador — is the one that matters most: it is validated with two or three phone calls, not more code.'),
  ))
  const fichaEn = (en.ficha ?? {}) as Rec
  if (vacio(fichaEn.tipo) && vacio(fichaEn.periodo) && vacio(fichaEn.fuentesDatos) && vacio(fichaEn.calidad)) {
    d.ficha = {
      tipo: 'Market-entry study (data analysis)',
      periodo: 'Trade 2015–2026 · decision as of 17 Nov 2026',
      fuentesDatos: 'UN Comtrade (with mirror data), USDA FAS, INEC, WOAH, Agrocalidad, SIPA/MAG',
      calidad: '12 data-quality rules · 53 assumptions with range and source',
    }
  }
  filas('destacados', 'cifra', {
    '24/24': { texto: 'scenarios with negative net present value' },
    '1–11 %': { texto: 'chance of making money, even with certification (Monte Carlo)' },
    '210': { texto: 'automated tests in a 15-stage pipeline' },
  })
  filas('hallazgos', 'cifra', {
    '−5,9 pp': { texto: 'drop in the US share of the pork offal China buys after the 2025 tariffs; Europe filled the gap' },
    '−0,16': { texto: 'USD margin per kilo: China pays 1.47 and in Ecuador the offal is already worth 1.38 plus 0.25 in costs' },
    '0': { texto: 'continental zones in Ecuador free of classical swine fever: no sanitary access today' },
    '1,14': { texto: 'USD/kg: offal price at the plant at which the project starts to make money (today 1.38)' },
  })
  filas('pasos', 'etiqueta', {
    '01': { titulo: 'Sources', texto: 'Comtrade, USDA, WOAH' },
    '02': { titulo: 'Medallion', texto: 'bronze · silver · gold' },
    '03': { titulo: 'Models', texto: 'scenarios, NPV, ITS' },
    '04': { titulo: 'Risk', texto: 'Monte Carlo and tornado' },
    '05': { titulo: 'Decision', texto: 'measurable triggers' },
  })
  filas('capturas', 'ruta', {
    '/proyectos/pork/simulador.webp': {
      alt: 'Dashboard What-If simulator: controls for local offal value, FOB price, discount rate, capacity and investment, and an NPV curve by offal value.',
      titulo: 'What-If simulator',
      leyenda: 'Move the assumptions and the model recomputes NPV, IRR and payback with the same functions as the pipeline.',
    },
    '/proyectos/pork/precio.webp': {
      alt: '“Landed price” page: stacked bars with FOB price, freight and insurance, and tariff for frozen offal by supplier in China.',
      titulo: 'Landed price',
      leyenda: 'Landed cost in China per supplier, split into FOB, freight and tariff; Ecuador is shown as “no access”.',
    },
    '/proyectos/pork/mapa.webp': {
      alt: 'Sanitary map: pigs per province in Ecuador according to INEC and the national status for classical swine fever and foot-and-mouth disease.',
      titulo: 'Sanitary map',
      leyenda: 'Where Ecuador’s pigs are and why the barrier is not provincial: classical swine fever is present across the mainland.',
    },
  })
  filas('decisiones', 'titulo', {
    Directorio: { titulo: 'Board', texto: 'Do not invest today and revisit when the triggers are met, keeping the option open.' },
    'Gremio y Estado': { titulo: 'Industry and government', texto: 'Prioritize a zone free of classical swine fever: without it there is no protocol with China.' },
    Compras: { titulo: 'Purchasing', texto: 'Check the real offal price with 2 or 3 slaughterhouses, the assumption that moves the result the most.' },
  })
  filas('enlaces', 'url', { [PDF]: { texto: 'Policy brief (PDF, 2 pages)' } })
  const seoEn = (en.seo ?? {}) as Rec
  if (vacio(seoEn.titulo)) {
    d.seo = {
      titulo: 'Pork to China — market-entry study',
      descripcion: 'Can Ecuador export pork offal to China because of the trade war? 24 scenarios, Monte Carlo and a recommendation with triggers.',
    }
  }
  if (PUBLICAR_INGLES && en.publicado !== true) d.publicado = true
  if (Object.keys(d).length > 0) {
    await payload.update({ collection: 'proyectos', id, locale: 'en', data: d as never })
    cambios.push(`Pork to China (EN): ${Object.keys(d).join(', ')}`)
  }

  console.log(cambios.length ? `Cambios:\n- ${cambios.join('\n- ')}` : 'Sin cambios: todo estaba al día.')
  process.exit(0)
}

main().catch((e) => {
  console.error('Contenido v9 falló:', e instanceof Error ? e.message : e)
  process.exit(1)
})
