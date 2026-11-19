/**
 * Contenido v10 (19 nov 2026): proyecto de datos "Favorita Demand Forecast" con su app en Streamlit.
 *
 * Fuente: README, portfolio.json y docs/insights.md del repositorio CarlosRomero55/favorita-demand-forecast.
 * Mismas reglas que v4: crea en español (publicado) solo si no existe, nunca pisa lo editado en el panel,
 * el inglés queda sin publicar salvo PUBLICAR_INGLES=true. Datos reales y públicos (Kaggle, Corporación Favorita).
 * Uso: pnpm contenido:v10
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { doc, p, ul } from './lexical'

type Rec = Record<string, unknown>

const PUBLICAR_INGLES = process.env.PUBLICAR_INGLES === 'true'
const SLUG = 'favorita-demand-forecast'
const DEMO = 'https://favorita-demand-forecast-k3bm7c69sld3b67ygiwxnu.streamlit.app/'
const REPO = 'https://github.com/CarlosRomero55/favorita-demand-forecast'

const vacio = (v: unknown) =>
  v === null || v === undefined || v === '' || (Array.isArray(v) && v.length === 0) ||
  (typeof v === 'object' && v !== null && 'root' in v && !/"text":"[^"]*\S/.test(JSON.stringify(v)))

const KAGGLE = 'https://www.kaggle.com/competitions/store-sales-time-series-forecasting'

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
        orden: 3,
        destacado: true,
        titulo: 'Favorita Demand Forecast: pronóstico de ventas de supermercados',
        slug: SLUG,
        area: 'ambos',
        titular: 'Cuánto venderá cada tienda en los próximos 16 días, y qué tanto mueven las ventas los feriados, las promociones y la quincena.',
        resumen: 'Pronóstico de demanda para 54 supermercados y 33 familias de producto de Ecuador, con 3 millones de registros reales: pipeline Medallion, LightGBM y una app bilingüe.',
        tecnologias: ['Python', 'SQL', 'DuckDB', 'LightGBM', 'SHAP', 'Streamlit'],
        portadaRuta: '/proyectos/favorita/explorador.webp',
        portadaAlt: 'Explorador de pronóstico de la app: ventas diarias históricas de una tienda de Quito en GROCERY I, el pronóstico de 16 días con su banda de error y el stock recomendado según el nivel de servicio.',
        portadaEtiqueta: 'App en línea',
        destacados: [
          { cifra: '12,8 %', texto: 'de error (WAPE) frente a 17,0 % de repetir la última semana' },
          { cifra: '1.782', texto: 'series tienda–familia pronosticadas con un solo modelo' },
          { cifra: '3 M', texto: 'registros diarios reales de 2013 a 2017' },
        ],
        hallazgos: [
          { cifra: '+8 %', texto: 'venden los días 1 a 3 después del pago; el día de pago, no', tono: 'destacado' },
          { cifra: '+12 %', texto: 'en feriado nacional; el feriado local resta 3,6 % en la tienda de esa ciudad', tono: 'normal' },
          { cifra: '+6,5 %', texto: 'es el efecto real de las promociones en GROCERY I; la comparación ingenua decía +121 %', tono: 'riesgo' },
          { cifra: '+40 %', texto: 'vendieron las tiendas de Manabí y Esmeraldas en las 4 semanas después del terremoto de 2016', tono: 'normal' },
        ],
        ficha: {
          tipo: 'Pronóstico de demanda (ciencia de datos)',
          periodo: 'Ventas diarias 2013–2017 · pronóstico a 16 días',
          fuentesDatos: 'Kaggle · Store Sales (Corporación Favorita, Ecuador)',
          calidad: '8 pruebas de calidad · pipeline idempotente · 24 pruebas automáticas',
        },
        preguntaNegocio: '¿Cuánto va a vender cada tienda de un supermercado ecuatoriano las próximas semanas, y qué tanto mueven las ventas los feriados, las promociones y la quincena?',
        problema: doc(
          p('Una cadena de supermercados necesita saber cuánto pedir para cada tienda y familia de producto. Si pide de más, se pierde dinero en inventario y productos que caducan; si pide de menos, hay estantes vacíos. Además, el calendario ecuatoriano pesa: quincenas, feriados nacionales y locales, y fechas como diciembre.'),
        ),
        datosLimpieza: doc(
          p('Los 6 archivos públicos de la competencia de Kaggle (ventas, tiendas, transacciones, feriados, petróleo y promociones) pasan por un pipeline Medallion en DuckDB: bronze con linaje, silver con llaves y feriados trasladados, y gold en estrella con 3.000.888 filas. Los mismos scripts están escritos en T-SQL para SQL Server.'),
          p('La revisión de calidad encontró meses sin registrar antes de julio de 2015. Corregirlo cambió un crecimiento aparente de +33 % en 2016 por uno comparable de +10 %, y el modelo se reentrenó desde esa fecha.'),
        ),
        metodo: doc(
          p('Un modelo LightGBM global para las 1.782 series, con variables de calendario, promociones, petróleo y rezagos de 16 días o más para que no use información del futuro.'),
          ul([
            'Backtest temporal con 3 cortes de 16 días, comparado con dos referencias simples: repetir la última semana y el promedio móvil de 14 días.',
            'Efectos de feriados, quincena y promociones medidos contra días comparables (mismo año, mes y día de la semana), no contra el promedio.',
            'Importancia de variables con SHAP y una recomendación de stock según el nivel de servicio elegido.',
            'App bilingüe en Streamlit que lee un resumen en Parquet, sin base de datos.',
          ]),
        ),
        pasos: [
          { etiqueta: '01', titulo: 'Kaggle', texto: '6 archivos públicos', color: 'ninguno' },
          { etiqueta: '02', titulo: 'Medallion', texto: 'bronze · silver · gold', color: 'ninguno' },
          { etiqueta: '03', titulo: 'EDA', texto: 'calendario y calidad', color: 'ninguno' },
          { etiqueta: '04', titulo: 'LightGBM', texto: 'backtest de 3 cortes', color: 'ninguno' },
          { etiqueta: '05', titulo: 'App', texto: 'pronóstico y stock', color: 'ninguno' },
        ],
        resultado: doc(
          p('El modelo reduce el error en una cuarta parte frente a repetir la última semana (WAPE de 12,8 % frente a 17,0 %), gana en los 3 cortes y en 32 de 33 familias. El total diario de la cadena se equivoca 4,5 %.'),
          p('Límites: la validación es de mediados de 2017, sin diciembre ni grandes feriados; los efectos son asociaciones, no causas probadas; todo está en unidades porque el dataset no trae precios; y la recomendación de stock es una regla didáctica, no la política real de Favorita.'),
        ),
        aprendizajes: doc(
          p('El hallazgo más útil no vino del modelo sino de revisar los datos: meses incompletos inflaban el crecimiento. Y comparar promociones dentro de la misma tienda y mes bajó su efecto de +121 % a +6,5 %: la forma de comparar importa más que el algoritmo.'),
        ),
        capturas: [
          {
            ruta: '/proyectos/favorita/drivers.webp',
            alt: 'Página «Qué mueve las ventas»: efecto mediano de previo a Navidad (+24,4 %), feriado nacional (+11,5 %), evento nacional (+2,0 %) y feriado local (−3,6 %) frente a un día normal comparable.',
            titulo: 'Qué mueve las ventas',
            leyenda: 'Feriados, promociones, quincena, terremoto y estacionalidad, medidos contra días comparables.',
          },
          {
            ruta: '/proyectos/favorita/calidad.webp',
            alt: 'Página «Calidad del modelo»: tabla con RMSLE, WAPE y sesgo de LightGBM, promedio móvil y naive estacional, y barras por cada corte del backtest.',
            titulo: 'Calidad del modelo',
            leyenda: 'Backtest de 3 cortes de 16 días: el modelo nunca ve la ventana con la que se evalúa.',
          },
          {
            ruta: '/proyectos/favorita/resumen.webp',
            alt: 'Página de resumen: 1.074 millones de unidades vendidas, venta diaria promedio de 856 mil, crecimiento comparable de +9,0 % y error de 12,8 %, con la venta diaria total por mes.',
            titulo: 'Resumen',
            leyenda: 'Las cifras principales de la cadena y el hallazgo clave en una sola vista.',
          },
        ],
        decisiones: [
          { titulo: 'Compras', texto: 'Cuánto pedir por tienda y familia para los próximos 16 días.' },
          { titulo: 'Inventario', texto: 'Qué stock de seguridad mantener según el nivel de servicio.' },
          { titulo: 'Comercial', texto: 'Cuándo reforzar: después de la quincena, antes de Navidad y en feriados nacionales.' },
        ],
        fuentes: [{ nombre: 'Kaggle · Store Sales – Time Series Forecasting (Corporación Favorita)', url: KAGGLE, fechaConsulta: '2026-11-19' }],
        demo: DEMO,
        repositorio: REPO,
        contieneDatosSimulados: false,
        seo: {
          titulo: 'Favorita Demand Forecast — pronóstico de demanda',
          descripcion: 'Pronóstico de ventas a 16 días para 54 supermercados de Ecuador con LightGBM: 12,8 % de error y efectos de feriados, promociones y quincena.',
        },
      } as never,
    })) as unknown as Rec
    cambios.push('Favorita Demand Forecast: creado y publicado en español')
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

  texto('titulo', 'Favorita Demand Forecast: supermarket sales forecasting')
  texto('slug', 'favorita-demand-forecast')
  texto('titular', 'How much each store will sell over the next 16 days, and how much holidays, promotions and paydays move sales.')
  texto('resumen', 'Demand forecast for 54 supermarkets and 33 product families in Ecuador, with 3 million real records: Medallion pipeline, LightGBM and a bilingual app.')
  texto('portadaAlt', 'App forecast explorer: daily sales history for a Quito store in GROCERY I, the 16-day forecast with its error band, and the recommended stock for the chosen service level.')
  texto('portadaEtiqueta', 'Live app')
  texto('preguntaNegocio', 'How much will each store of an Ecuadorian supermarket chain sell over the coming weeks, and how much do holidays, promotions and paydays move sales?')
  texto('problema', doc(
    p('A supermarket chain needs to know how much to order for each store and product family. Order too much and money is tied up in inventory and expiring products; order too little and shelves go empty. The Ecuadorian calendar matters too: paydays, national and local holidays, and dates like December.'),
  ))
  texto('datosLimpieza', doc(
    p('The 6 public files from the Kaggle competition (sales, stores, transactions, holidays, oil and promotions) go through a Medallion pipeline in DuckDB: bronze with lineage, silver with keys and transferred holidays, and a star-schema gold layer with 3,000,888 rows. The same scripts are also written in T-SQL for SQL Server.'),
    p('The data-quality review found unrecorded months before July 2015. Fixing it turned an apparent +33% growth in 2016 into a comparable +10%, and the model was retrained from that date.'),
  ))
  texto('metodo', doc(
    p('A global LightGBM model for all 1,782 series, with calendar, promotion and oil features and lags of 16 days or more so it never uses information from the future.'),
    ul([
      'Time-based backtest with 3 cuts of 16 days, compared with two simple baselines: repeating last week and a 14-day moving average.',
      'Holiday, payday and promotion effects measured against comparable days (same year, month and weekday), not against the average.',
      'Feature importance with SHAP and a stock recommendation based on the chosen service level.',
      'Bilingual Streamlit app that reads a Parquet summary, with no database.',
    ]),
  ))
  texto('resultado', doc(
    p('The model cuts the error by a quarter compared with repeating last week (12.8% vs. 17.0% WAPE), wins in all 3 cuts and in 32 of 33 families. The chain’s daily total is off by 4.5%.'),
    p('Limits: validation covers mid-2017, with no December or major holidays; effects are associations, not proven causes; everything is in units because the dataset has no prices; and the stock recommendation is a teaching rule, not Favorita’s actual policy.'),
  ))
  texto('aprendizajes', doc(
    p('The most useful finding came from checking the data, not from the model: incomplete months were inflating growth. And comparing promotions within the same store and month brought their effect down from +121% to +6.5%: how you compare matters more than the algorithm.'),
  ))
  const fichaEn = (en.ficha ?? {}) as Rec
  if (vacio(fichaEn.tipo) && vacio(fichaEn.periodo) && vacio(fichaEn.fuentesDatos) && vacio(fichaEn.calidad)) {
    d.ficha = {
      tipo: 'Demand forecasting (data science)',
      periodo: 'Daily sales 2013–2017 · 16-day forecast',
      fuentesDatos: 'Kaggle · Store Sales (Corporación Favorita, Ecuador)',
      calidad: '8 data-quality checks · idempotent pipeline · 24 automated tests',
    }
  }
  filas('destacados', 'cifra', {
    '12,8 %': { texto: 'error (WAPE) vs. 17.0% when repeating last week' },
    '1.782': { texto: 'store–family series forecast with a single model' },
    '3 M': { texto: 'real daily records from 2013 to 2017' },
  })
  filas('hallazgos', 'cifra', {
    '+8 %': { texto: 'more sales on days 1 to 3 after payday; payday itself, no' },
    '+12 %': { texto: 'on national holidays; local holidays cut 3.6% at that city’s store' },
    '+6,5 %': { texto: 'is the real promotion effect in GROCERY I; the naive comparison said +121%' },
    '+40 %': { texto: 'sales at stores in Manabí and Esmeraldas in the 4 weeks after the 2016 earthquake' },
  })
  filas('pasos', 'etiqueta', {
    '01': { titulo: 'Kaggle', texto: '6 public files' },
    '02': { titulo: 'Medallion', texto: 'bronze · silver · gold' },
    '03': { titulo: 'EDA', texto: 'calendar and quality' },
    '04': { titulo: 'LightGBM', texto: '3-cut backtest' },
    '05': { titulo: 'App', texto: 'forecast and stock' },
  })
  filas('capturas', 'ruta', {
    '/proyectos/favorita/drivers.webp': {
      alt: '“What drives sales” page: median effect of pre-Christmas (+24.4%), national holiday (+11.5%), national event (+2.0%) and local holiday (−3.6%) vs. a comparable normal day.',
      titulo: 'What drives sales',
      leyenda: 'Holidays, promotions, payday, earthquake and seasonality, measured against comparable days.',
    },
    '/proyectos/favorita/calidad.webp': {
      alt: '“Model quality” page: table with RMSLE, WAPE and bias for LightGBM, moving average and seasonal naive, plus bars for each backtest cut.',
      titulo: 'Model quality',
      leyenda: '3-cut backtest of 16 days: the model never sees the window it is evaluated on.',
    },
    '/proyectos/favorita/resumen.webp': {
      alt: 'Summary page: 1,074 million units sold, average daily sales of 856 thousand, comparable growth of +9.0% and 12.8% error, with total daily sales by month.',
      titulo: 'Summary',
      leyenda: 'The chain’s headline figures and the key finding in a single view.',
    },
  })
  filas('decisiones', 'titulo', {
    Compras: { titulo: 'Purchasing', texto: 'How much to order per store and family for the next 16 days.' },
    Inventario: { titulo: 'Inventory', texto: 'Which safety stock to keep for the chosen service level.' },
    Comercial: { titulo: 'Sales', texto: 'When to reinforce: after payday, before Christmas and on national holidays.' },
  })
  filas('fuentes', 'url', { [KAGGLE]: { nombre: 'Kaggle · Store Sales – Time Series Forecasting (Corporación Favorita)' } })
  const seoEn = (en.seo ?? {}) as Rec
  if (vacio(seoEn.titulo)) {
    d.seo = {
      titulo: 'Favorita Demand Forecast — demand forecasting',
      descripcion: '16-day sales forecast for 54 supermarkets in Ecuador with LightGBM: 12.8% error and the effect of holidays, promotions and paydays.',
    }
  }
  if (PUBLICAR_INGLES && en.publicado !== true) d.publicado = true
  if (Object.keys(d).length > 0) {
    await payload.update({ collection: 'proyectos', id, locale: 'en', data: d as never })
    cambios.push(`Favorita (EN): ${Object.keys(d).join(', ')}`)
  }

  console.log(cambios.length ? `Cambios:\n- ${cambios.join('\n- ')}` : 'Sin cambios: todo estaba al día.')
  process.exit(0)
}

main().catch((e) => {
  console.error('Contenido v10 falló:', e instanceof Error ? e.message : e)
  process.exit(1)
})
