/**
 * Contenido v9 (17 nov 2026): proyecto "Pork to China" (cerdo ecuatoriano a China, guerra comercial).
 *
 * Fuente: repositorio público CarlosRomero55/pork-to-china (README, docs/recommendation.md, docs/policy_brief.md),
 * cifras de la corrida 86 del pipeline. La historia por pasos usa data/real/pork-historia.json (datos reales).
 * Mismas reglas que v4–v8: crea en español (publicado) solo si no existe, nunca pisa lo editado en el panel,
 * el inglés queda SIN publicar salvo PUBLICAR_INGLES=true (Carlos lo revisa antes). Empresa ficticia (AgroPorc Ecuador).
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
const BRIEF = `${REPO}/blob/main/docs/policy_brief.pdf`
const CONSULTA = '2026-11-17'

const vacio = (v: unknown) =>
  v === null || v === undefined || v === '' || (Array.isArray(v) && v.length === 0) ||
  (typeof v === 'object' && v !== null && 'root' in v && !/"text":"[^"]*\S/.test(JSON.stringify(v)))

const FUENTES = [
  { nombre: 'UN Comtrade (importaciones de China y datos espejo)', url: 'https://comtradeplus.un.org/', fechaConsulta: CONSULTA },
  { nombre: 'USDA FAS — Production, Supply and Distribution (PSD)', url: 'https://apps.fas.usda.gov/psdonline/', fechaConsulta: CONSULTA },
  { nombre: 'INEC — Encuesta de Superficie y Producción Agropecuaria Continua (ESPAC)', url: 'https://www.ecuadorencifras.gob.ec/estadisticas-agropecuarias-2/', fechaConsulta: CONSULTA },
  { nombre: 'OMSA — Resolución 26 (2024), estatus de peste porcina clásica', url: 'https://woah.org/app/uploads/2024/06/91gs-2024-res-26-tech-csf-status-final-sp.pdf', fechaConsulta: CONSULTA },
]

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
        destacado: false,
        titulo: 'Pork to China',
        slug: SLUG,
        area: 'ambos',
        titular: '¿Puede Ecuador aprovechar la guerra comercial para venderle cerdo a China? Hoy no, y el proyecto dice exactamente qué tendría que cambiar.',
        resumen: 'Estudio de entrada a mercado con datos públicos para una porcina ficticia: pipeline MySQL + Python de 15 etapas, 24 escenarios financieros, Monte Carlo, tablero y policy brief.',
        tecnologias: ['Python', 'MySQL', 'SQL', 'Streamlit', 'FastAPI', 'Plotly', 'NumPy', 'pytest'],
        portadaRuta: '/proyectos/pork/01_recomendacion.webp',
        portadaAlt: 'Página "Recomendación: no invertir hoy" del tablero: texto con la decisión y cinco tarjetas de disparadores, cuatro en rojo (no cumplido) y una en ámbar (en camino).',
        portadaEtiqueta: 'Streamlit · 9 páginas',
        destacados: [
          { cifra: '24 / 24', texto: 'escenarios con VAN negativo a los precios de hoy' },
          { cifra: '−0,16', texto: 'USD de margen por kilo exportado: más volumen es más pérdida' },
          { cifra: '210', texto: 'pruebas automáticas en un pipeline de 15 etapas' },
        ],
        hallazgos: [
          { cifra: '−5,9 pp', texto: 'cayó la participación de EE. UU. en las vísceras que compra China tras los aranceles de 2025', tono: 'destacado' },
          { cifra: '+10,2 pp', texto: 'recuperó EE. UU. en 2020 tras perder 9,6 en 2018: la ventana se cierra', tono: 'riesgo' },
          { cifra: '~7 años', texto: 'tardaron Costa Rica y Brasil desde el protocolo hasta el primer envío; Ecuador no tiene protocolo', tono: 'riesgo' },
          { cifra: '1–11 %', texto: 'probabilidad de VAN positivo aun con certificación (Monte Carlo de 10.000 sorteos)', tono: 'normal' },
        ],
        ficha: {
          tipo: 'Estudio de entrada a mercado (empresa ficticia)',
          periodo: 'Datos 2015–2026 · análisis de noviembre de 2026',
          fuentesDatos: 'UN Comtrade, USDA PSD, INEC ESPAC, OMSA, Agrocalidad, SIPA',
          calidad: '12 reglas de calidad de datos · 210 pruebas · cifras del README verificadas contra la base',
        },
        preguntaNegocio: '¿Hay espacio real para que una empresa ecuatoriana venda cerdo a China aprovechando los aranceles a EE. UU.? ¿Cuánto, contra quién y qué falta para entrar?',
        problema: doc(
          p('La guerra comercial entre Estados Unidos y China dejó espacio para otros proveedores de cerdo, y en Ecuador se habló de aprovecharlo. Pero decidir una inversión exige más que un titular: saber cuánto compra China, a qué precio, si Ecuador tiene permiso sanitario para venderle y si cada kilo exportado deja dinero.'),
        ),
        metodo: doc(
          p('Planteé el caso como el analista de AgroPorc Ecuador, una empresa ficticia que procesa cerdo y evalúa exportar vísceras congeladas, el producto donde la caída de EE. UU. dejó más espacio.'),
          ul([
            'Precio puesto en China por proveedor, con aranceles reconstruidos mes a mes (historia SCD tipo 2).',
            '24 escenarios: 3 casos de guerra comercial × 2 trayectorias de autosuficiencia china × 4 años de certificación sanitaria.',
            'Modelo de flujo de caja con VAN, TIR, payback y punto de equilibrio; supuestos con rango mínimo–base–máximo y fuente.',
            'Serie de tiempo interrumpida (regresión segmentada con errores de Newey-West) para medir si los aranceles de 2018 y las exclusiones de 2020 movieron de verdad la participación de EE. UU.',
            'Monte Carlo de 10.000 sorteos con números aleatorios comunes y análisis de tornado.',
            'Disparadores medibles para revisar la decisión, pre-mortem y un policy brief para Agrocalidad y el Ministerio de Producción.',
          ]),
        ),
        datosLimpieza: doc(
          p('China reporta tarde a UN Comtrade, así que reconstruí sus importaciones con datos espejo: lo que declaran sus 12 principales proveedores. Los datos crudos quedan intactos en una capa bronze; silver los normaliza y gold los organiza en un esquema estrella. Doce reglas de calidad marcan los registros dudosos sin borrarlos.'),
          p('El tablero y la API se conectan con un usuario de solo lectura que ve únicamente gold. Las migraciones están versionadas y el pipeline completo corre con un solo comando, en 15 etapas aisladas y con bitácora de cada corrida.'),
        ),
        pasos: [
          { etiqueta: 'BRONZE', titulo: 'Crudo', texto: 'Comtrade, USDA, INEC', color: 'bronze' },
          { etiqueta: 'SILVER', titulo: 'Normalizado', texto: 'Aranceles SCD2, supuestos', color: 'silver' },
          { etiqueta: 'GOLD', titulo: 'Estrella', texto: 'Hechos y dimensiones', color: 'gold' },
          { etiqueta: 'MODELO', titulo: 'Decisión', texto: 'VAN, ITS, Monte Carlo', color: 'ninguno' },
          { etiqueta: 'SALIDA', titulo: 'Para decidir', texto: 'Tablero, API, brief', color: 'ninguno' },
        ],
        resultado: doc(
          p('La recomendación es no invertir hoy. La ventana existe, pero es reversible; Ecuador no tiene permiso sanitario para venderle cerdo a China, y aun con permiso cada kilo exportado dejaría un margen negativo. No es un "nunca": definí cinco disparadores con umbrales que salen del modelo, y el tablero los recalcula en cada corrida.'),
        ),
        capturas: [
          {
            ruta: '/proyectos/pork/02_escenarios.webp',
            alt: 'Mapa de calor del VAN de los 24 escenarios, todos en tonos rojos (negativos), con la explicación de que exportar solo conviene si la víscera vale menos en Ecuador.',
            titulo: 'Los 24 escenarios',
            leyenda: 'Ningún escenario tiene VAN positivo con la víscera valorada a 1,38 USD/kg en Ecuador: ese es el dato que define el negocio.',
          },
          {
            ruta: '/proyectos/pork/04_serie_tiempo.webp',
            alt: 'Página de serie de tiempo interrumpida con la participación de EE. UU., su tendencia ajustada y el contrafactual sin aranceles.',
            titulo: 'Serie de tiempo interrumpida',
            leyenda: 'Los aranceles de 2018 le quitaron 9,6 puntos a EE. UU. y las exclusiones de 2020 le devolvieron 10,2: la ventana se abre y se cierra.',
          },
          {
            ruta: '/proyectos/pork/05_monte_carlo.webp',
            alt: 'Página de Monte Carlo con la probabilidad de VAN positivo por escenario, histograma del VAN y gráfico de tornado.',
            titulo: 'Monte Carlo',
            leyenda: 'Con 10.000 combinaciones de supuestos, la probabilidad de ganar va de 1 % a 11 %; el valor local de la víscera explica casi todo el riesgo.',
          },
          {
            ruta: '/proyectos/pork/03_mapa.webp',
            alt: 'Mapa sanitario de Ecuador por provincia con los cerdos que se venden al año y el estado de cada enfermedad frente a China.',
            titulo: 'Mapa sanitario',
            leyenda: 'Imbabura, Santo Domingo, Guayas y Carchi concentran el 37 % de los cerdos que se venden al año: ahí empezaría una zona libre.',
          },
        ],
        decisiones: [
          { titulo: 'Inversionista', texto: 'No invertir hoy y vigilar cinco disparadores con umbrales calculados por el modelo.' },
          { titulo: 'Agrocalidad', texto: 'Una zona continental libre de peste porcina clásica, empezando por las provincias que más producen.' },
          { titulo: 'Ministerio de Producción', texto: 'Abrir ya el protocolo sanitario con China, con las vísceras incluidas desde el inicio.' },
        ],
        aprendizajes: doc(
          p('La pregunta útil no era "¿cuánto compra China?", sino "¿cuánto deja cada kilo?". Con margen negativo, el volumen multiplica la pérdida. También aprendí a convertir una recomendación negativa en algo accionable: umbrales medibles que dicen cuándo volver a mirar la decisión.'),
          p('El supuesto que más pesa, el precio en planta de la víscera, no tiene serie pública; el siguiente paso es validarlo con entrevistas al sector.'),
        ),
        enlaces: [{ texto: 'Policy brief (PDF)', url: BRIEF }],
        repositorio: REPO,
        contieneDatosSimulados: false,
        simulador: 'cerdo-historia',
        fuentes: FUENTES,
        seo: {
          titulo: 'Pork to China — caso de estudio de entrada a mercado',
          descripcion: '¿Puede Ecuador venderle cerdo a China por la guerra comercial? Pipeline de datos, modelo financiero, Monte Carlo y una recomendación con disparadores.',
        },
      } as never,
    })) as unknown as Rec
    cambios.push('Pork to China: creado y publicado en español')
  }

  // ——— Proyecto en inglés (borrador hasta que Carlos lo revise) ———
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

  texto('titulo', 'Pork to China')
  texto('slug', 'pork-to-china')
  texto('titular', 'Can Ecuador use the trade war to sell pork to China? Not today, and the project says exactly what would have to change.')
  texto('resumen', 'Market-entry study with public data for a fictitious pork processor: 15-stage MySQL + Python pipeline, 24 financial scenarios, Monte Carlo, dashboard and policy brief.')
  texto('portadaAlt', 'Dashboard page "Recommendation: don’t invest today": text with the decision and five trigger cards, four in red (not met) and one in amber (on track).')
  texto('portadaEtiqueta', 'Streamlit · 9 pages')
  texto('preguntaNegocio', 'Is there real room for an Ecuadorian company to sell pork to China thanks to the US tariffs? How much, against whom, and what is missing to get in?')
  texto('problema', doc(
    p('The US–China trade war left room for other pork suppliers, and in Ecuador people talked about taking it. But deciding on an investment takes more than a headline: knowing how much China buys, at what price, whether Ecuador is sanitarily allowed to sell to it, and whether each exported kilo makes money.'),
  ))
  texto('metodo', doc(
    p('I framed the case as the analyst of AgroPorc Ecuador, a fictitious pork processor considering exporting frozen offal, the product where the US drop left the most room.'),
    ul([
      'Landed price in China by supplier, with tariffs rebuilt month by month (SCD type 2 history).',
      '24 scenarios: 3 trade-war cases × 2 Chinese self-sufficiency paths × 4 sanitary certification years.',
      'Cash-flow model with NPV, IRR, payback and break-even; every assumption with a min–base–max range and a source.',
      'Interrupted time series (segmented regression with Newey-West errors) to test whether the 2018 tariffs and the 2020 exclusions really moved the US share.',
      'Monte Carlo with 10,000 draws, common random numbers and tornado analysis.',
      'Measurable triggers to revisit the decision, a pre-mortem and a policy brief for Ecuador’s sanitary agency and Ministry of Production.',
    ]),
  ))
  texto('datosLimpieza', doc(
    p('China reports late to UN Comtrade, so I rebuilt its imports with mirror data: what its 12 main suppliers declare. Raw data stays untouched in a bronze layer; silver normalizes it and gold organizes it as a star schema. Twelve data-quality rules flag doubtful records without deleting them.'),
    p('The dashboard and the API connect with a read-only user that only sees gold. Migrations are versioned, and the whole pipeline runs with one command, in 15 isolated stages with a log of every run.'),
  ))
  texto('resultado', doc(
    p('The recommendation is not to invest today. The window exists but is reversible; Ecuador is not sanitarily allowed to sell pork to China, and even with access every exported kilo would have a negative margin. It is not a "never": I defined five triggers with thresholds that come from the model, and the dashboard recomputes them on every run.'),
  ))
  texto('aprendizajes', doc(
    p('The useful question was not "how much does China buy?" but "how much does each kilo leave?". With a negative margin, volume multiplies the loss. I also learned to turn a negative recommendation into something actionable: measurable thresholds that say when to look at the decision again.'),
    p('The assumption that matters most, the plant price of offal, has no public series; the next step is to validate it with industry interviews.'),
  ))
  const fichaEn = (en.ficha ?? {}) as Rec
  if (vacio(fichaEn.tipo) && vacio(fichaEn.periodo) && vacio(fichaEn.fuentesDatos) && vacio(fichaEn.calidad)) {
    d.ficha = {
      tipo: 'Market-entry study (fictitious company)',
      periodo: 'Data 2015–2026 · analysis from November 2026',
      fuentesDatos: 'UN Comtrade, USDA PSD, INEC ESPAC, WOAH, Agrocalidad, SIPA',
      calidad: '12 data-quality rules · 210 tests · README figures checked against the database',
    }
  }
  filas('destacados', 'cifra', {
    '24 / 24': { texto: 'scenarios with negative NPV at today’s prices' },
    '−0,16': { texto: 'USD margin per exported kilo: more volume means more loss' },
    '210': { texto: 'automated tests in a 15-stage pipeline' },
  })
  filas('hallazgos', 'cifra', {
    '−5,9 pp': { texto: 'drop in the US share of the offal China buys after the 2025 tariffs' },
    '+10,2 pp': { texto: 'won back by the US in 2020 after losing 9.6 in 2018: the window closes' },
    '~7 años': { texto: 'took Costa Rica and Brazil from protocol to first shipment; Ecuador has no protocol' },
    '1–11 %': { texto: 'probability of a positive NPV even with certification (10,000-draw Monte Carlo)' },
  })
  filas('pasos', 'etiqueta', {
    BRONZE: { titulo: 'Raw', texto: 'Comtrade, USDA, INEC' },
    SILVER: { titulo: 'Normalized', texto: 'SCD2 tariffs, assumptions' },
    GOLD: { titulo: 'Star schema', texto: 'Facts and dimensions' },
    MODELO: { titulo: 'Decision', texto: 'NPV, ITS, Monte Carlo' },
    SALIDA: { titulo: 'To decide', texto: 'Dashboard, API, brief' },
  })
  filas('capturas', 'ruta', {
    '/proyectos/pork/02_escenarios.webp': {
      alt: 'Heat map of the NPV of the 24 scenarios, all in red (negative), with the note that exporting only pays if offal is worth less in Ecuador.',
      titulo: 'The 24 scenarios',
      leyenda: 'No scenario has a positive NPV with offal valued at 1.38 USD/kg in Ecuador: that is the figure that defines the business.',
    },
    '/proyectos/pork/04_serie_tiempo.webp': {
      alt: 'Interrupted time series page with the US share, its fitted trend and the counterfactual without tariffs.',
      titulo: 'Interrupted time series',
      leyenda: 'The 2018 tariffs took 9.6 points from the US and the 2020 exclusions gave back 10.2: the window opens and closes.',
    },
    '/proyectos/pork/05_monte_carlo.webp': {
      alt: 'Monte Carlo page with the probability of a positive NPV by scenario, an NPV histogram and a tornado chart.',
      titulo: 'Monte Carlo',
      leyenda: 'Across 10,000 combinations of assumptions, the probability of making money ranges from 1% to 11%; the local value of offal explains almost all the risk.',
    },
    '/proyectos/pork/03_mapa.webp': {
      alt: 'Sanitary map of Ecuador by province with pigs sold per year and the status of each disease regarding China.',
      titulo: 'Sanitary map',
      leyenda: 'Imbabura, Santo Domingo, Guayas and Carchi account for 37% of the pigs sold each year: a free zone would start there.',
    },
  })
  filas('decisiones', 'titulo', {
    Inversionista: { titulo: 'Investor', texto: 'Don’t invest today and watch five triggers with thresholds computed by the model.' },
    Agrocalidad: { titulo: 'Sanitary agency (Agrocalidad)', texto: 'A continental zone free of classical swine fever, starting with the provinces that produce the most.' },
    'Ministerio de Producción': { titulo: 'Ministry of Production', texto: 'Open the sanitary protocol with China now, with offal included from the start.' },
  })
  filas('enlaces', 'url', { [BRIEF]: { texto: 'Policy brief (PDF, Spanish)' } })
  filas('fuentes', 'url', {
    'https://comtradeplus.un.org/': { nombre: 'UN Comtrade (China imports and mirror data)' },
    'https://apps.fas.usda.gov/psdonline/': { nombre: 'USDA FAS — Production, Supply and Distribution (PSD)' },
    'https://www.ecuadorencifras.gob.ec/estadisticas-agropecuarias-2/': { nombre: 'INEC — Continuous Agricultural Survey (ESPAC)' },
    'https://woah.org/app/uploads/2024/06/91gs-2024-res-26-tech-csf-status-final-sp.pdf': { nombre: 'WOAH — Resolution 26 (2024), classical swine fever status' },
  })
  const seoEn = (en.seo ?? {}) as Rec
  if (vacio(seoEn.titulo)) {
    d.seo = {
      titulo: 'Pork to China — market-entry case study',
      descripcion: 'Can Ecuador sell pork to China thanks to the trade war? Data pipeline, financial model, Monte Carlo and a recommendation with triggers.',
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
