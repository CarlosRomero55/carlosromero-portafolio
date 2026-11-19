/**
 * Contenido v11 (19 nov 2026): tres artículos de datos basados en los proyectos de Carlos.
 *
 * Cifras tomadas de los repositorios:
 *  - favorita-demand-forecast: docs/insights.md y docs/adr/0004-registro-incompleto-antes-de-2015.md
 *  - pork-to-china: docs/recommendation.md, docs/finance.md, docs/its.md y docs/monte_carlo.md (corrida 86)
 * Reglas: cada artículo se crea solo si no existe y se publica en español (Carlos pidió publicarlos).
 * El inglés se llena si está vacío y se publica con PUBLICAR_INGLES=true, como el resto del sitio.
 * Nunca pisa lo editado en el panel. Uso: pnpm contenido:v11
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { doc, h3, p, ul } from './lexical'

type Rec = Record<string, unknown>
type Idioma = { titulo: string; slug: string; resumen: string; portadaAlt: string; contenido: unknown; seo: { titulo: string; descripcion: string } }

const PUBLICAR_INGLES = process.env.PUBLICAR_INGLES === 'true'
const vacio = (v: unknown) => v === null || v === undefined || v === ''

const ARTICULOS: { proyecto: string; fecha: string; portadaRuta: string; etiquetas: string[]; es: Idioma; en: Idioma }[] = [
  {
    proyecto: 'favorita-demand-forecast',
    fecha: '2026-11-19',
    portadaRuta: '/proyectos/favorita/drivers.webp',
    etiquetas: ['Análisis de datos', 'Retail', 'Python'],
    es: {
      titulo: 'Las promociones no venden 121 % más: cómo comparar cambia la respuesta',
      slug: 'las-promociones-no-venden-121-mas',
      resumen: 'Con datos reales de 54 supermercados ecuatorianos, una comparación simple dice que las promociones casi duplican las ventas. Comparando bien, el efecto es +6,5 %.',
      portadaAlt: 'Página «Qué mueve las ventas» de la app de Favorita Demand Forecast, con el efecto de feriados frente a días comparables.',
      contenido: doc(
        p('En el proyecto Favorita Demand Forecast trabajé con 3 millones de registros diarios reales de 54 supermercados de Ecuador (2013–2017). Una de las primeras preguntas fue la más obvia: ¿cuánto venden las promociones?'),
        h3('La respuesta fácil: +121 %'),
        p('Si se compara el promedio de ventas de los días con promoción contra los días sin promoción, la familia GROCERY I vende 121 % más con promoción. Es un número que cualquiera pondría en una presentación.'),
        h3('El problema: no se comparan días parecidos'),
        p('Las promociones no se reparten al azar. En estos datos crecieron con los años y se concentran en las tiendas más grandes. Entonces, los días «con promoción» son también días de tiendas grandes y de años con más ventas. La comparación simple mezcla el efecto de la promoción con el tamaño de la tienda y el paso del tiempo.'),
        h3('Comparar dentro de la misma tienda y el mismo mes'),
        p('Para separar esos efectos comparé cada día con promoción contra días sin promoción de la misma tienda, la misma familia y el mismo mes. Con esa comparación, el efecto en GROCERY I baja a +6,5 %. Ponderado en todas las familias, es +9 %.'),
        ul([
          'Productos frescos responden más: PRODUCE +20 %, MEATS +21 %, POULTRY +12 %.',
          'Lácteos y limpieza responden poco: DAIRY y CLEANING, +3 %.',
        ]),
        h3('Qué haría con esto un gerente'),
        p('Medir las promociones con grupos de control —tiendas o semanas sin promoción— antes de ampliarlas, y priorizar los frescos, donde la respuesta observada es mayor. Y desconfiar de cualquier cifra que no diga contra qué se comparó.'),
        p('Una aclaración honesta: aun con esta comparación, es una asociación, no un efecto causal probado. No sé cómo se eligieron los productos promocionados. Lo que sí sé es que pasar de +121 % a +6,5 % cambia por completo cualquier decisión de presupuesto.'),
      ),
      seo: {
        titulo: 'Las promociones no venden 121 % más',
        descripcion: 'Una comparación ingenua dice +121 %; dentro de la misma tienda y mes, +6,5 %. Lo que enseñan 3 millones de registros de supermercados de Ecuador.',
      },
    },
    en: {
      titulo: 'Promotions don’t sell 121% more: how the comparison changes the answer',
      slug: 'promotions-dont-sell-121-percent-more',
      resumen: 'With real data from 54 Ecuadorian supermarkets, a simple comparison says promotions almost double sales. Compared properly, the effect is +6.5%.',
      portadaAlt: '“What drives sales” page of the Favorita Demand Forecast app, showing holiday effects against comparable days.',
      contenido: doc(
        p('In the Favorita Demand Forecast project I worked with 3 million real daily records from 54 supermarkets in Ecuador (2013–2017). One of the first questions was the most obvious one: how much do promotions sell?'),
        h3('The easy answer: +121%'),
        p('If you compare average sales on promotion days against days without promotion, the GROCERY I family sells 121% more on promotion. It is a number anyone would put in a presentation.'),
        h3('The problem: the days being compared are not alike'),
        p('Promotions are not spread at random. In this data they grew over the years and are concentrated in the largest stores. So “promotion” days are also days at big stores and in higher-selling years. The simple comparison mixes the promotion effect with store size and the passage of time.'),
        h3('Comparing within the same store and month'),
        p('To separate those effects, I compared each promotion day with non-promotion days at the same store, in the same family and the same month. With that comparison, the effect in GROCERY I drops to +6.5%. Weighted across all families, it is +9%.'),
        ul([
          'Fresh products respond more: PRODUCE +20%, MEATS +21%, POULTRY +12%.',
          'Dairy and cleaning respond little: DAIRY and CLEANING, +3%.',
        ]),
        h3('What a manager would do with this'),
        p('Measure promotions with control groups —stores or weeks without promotion— before scaling them, and prioritize fresh products, where the observed response is larger. And be wary of any figure that does not say what it was compared against.'),
        p('An honest caveat: even with this comparison, it is an association, not a proven causal effect. I don’t know how the promoted products were chosen. What I do know is that going from +121% to +6.5% completely changes any budget decision.'),
      ),
      seo: {
        titulo: 'Promotions don’t sell 121% more',
        descripcion: 'A naive comparison says +121%; within the same store and month, +6.5%. What 3 million supermarket records from Ecuador teach.',
      },
    },
  },
  {
    proyecto: 'favorita-demand-forecast',
    fecha: '2026-11-19',
    portadaRuta: '/proyectos/favorita/resumen.webp',
    etiquetas: ['Calidad de datos', 'Análisis de datos', 'SQL'],
    es: {
      titulo: 'El crecimiento que no existía: revisar los datos antes del modelo',
      slug: 'el-crecimiento-que-no-existia',
      resumen: 'Las ventas de una cadena de supermercados parecían crecer 33 % en 2016. El crecimiento comparable era 10 %: faltaban meses de registro antes de 2015.',
      portadaAlt: 'Página de resumen de la app de Favorita Demand Forecast, con la venta diaria total por mes y el crecimiento comparable de 2017.',
      contenido: doc(
        p('Cuando uno tiene un dataset limpio de Kaggle, la tentación es ir directo al modelo. En Favorita Demand Forecast, la revisión de calidad de datos terminó siendo uno de los hallazgos más importantes del proyecto.'),
        h3('Un crecimiento demasiado bueno'),
        p('Al comparar las ventas totales de la cadena, 2016 crecía 33 % frente a 2015. Para una cadena de supermercados madura, eso es raro. Antes de celebrarlo, abrí las ventas por familia de producto y por mes.'),
        h3('Lo que mostraban las familias'),
        ul([
          'PRODUCE (frutas y verduras) registraba prácticamente cero en toda la cadena la mayoría de los meses hasta mayo de 2015, y luego saltaba a su nivel normal.',
          'BEVERAGES caía a la mitad en meses alternos de 2014 y de enero a abril de 2015.',
          'Varias familias no alimentarias no tenían ninguna venta antes de junio de 2015.',
        ]),
        p('Nadie deja de comprar frutas durante meses. No eran cambios de demanda: eran registros incompletos o cambios en cómo se registraban las ventas.'),
        h3('Corregir sin esconder'),
        p('Documenté la decisión en un registro de arquitectura (ADR) y cambié dos cosas. Los crecimientos se calculan solo con las 18 familias de registro estable: así 2016 crece +10 % y 2017 +9 %, no +33 %. Y el modelo se entrena desde julio de 2015, cuando el registro ya es estable.'),
        p('Lo curioso: la exactitud del modelo casi no cambió (WAPE de 12,8 % en ambos casos). La decisión se tomó por calidad de datos, no por la métrica. Un modelo puede seguir acertando mientras el análisis que lo acompaña cuenta una historia falsa.'),
        h3('La lección'),
        p('Antes de explicar un número, hay que preguntarse si el dato que lo produce es comparable en el tiempo. Una tabla por familia y por mes tomó minutos y evitó presentar un crecimiento que no existía.'),
      ),
      seo: {
        titulo: 'El crecimiento que no existía',
        descripcion: 'Un +33 % que en realidad era +10 %: cómo los meses sin registrar inflaban el crecimiento de una cadena de supermercados de Ecuador.',
      },
    },
    en: {
      titulo: 'The growth that wasn’t there: checking the data before the model',
      slug: 'the-growth-that-was-not-there',
      resumen: 'A supermarket chain’s sales seemed to grow 33% in 2016. Comparable growth was 10%: months of records were missing before 2015.',
      portadaAlt: 'Summary page of the Favorita Demand Forecast app, with total daily sales by month and comparable growth for 2017.',
      contenido: doc(
        p('With a clean Kaggle dataset, the temptation is to go straight to the model. In Favorita Demand Forecast, the data-quality review turned out to be one of the most important findings of the project.'),
        h3('Growth that was too good'),
        p('Comparing the chain’s total sales, 2016 grew 33% over 2015. For a mature supermarket chain, that is unusual. Before celebrating, I broke sales down by product family and by month.'),
        h3('What the families showed'),
        ul([
          'PRODUCE (fruit and vegetables) recorded practically zero across the chain in most months until May 2015, and then jumped to its normal level.',
          'BEVERAGES dropped by half in alternate months of 2014 and from January to April 2015.',
          'Several non-food families had no sales at all before June 2015.',
        ]),
        p('Nobody stops buying fruit for months. These were not changes in demand: they were incomplete records or changes in how sales were recorded.'),
        h3('Fixing it without hiding it'),
        p('I documented the decision in an architecture decision record (ADR) and changed two things. Growth is calculated only with the 18 families with stable records: that way 2016 grows +10% and 2017 +9%, not +33%. And the model is trained from July 2015, once records are stable.'),
        p('The curious part: model accuracy barely changed (12.8% WAPE in both cases). The decision was made for data quality, not for the metric. A model can keep being accurate while the analysis around it tells a false story.'),
        h3('The lesson'),
        p('Before explaining a number, ask whether the data behind it is comparable over time. A table by family and month took minutes and avoided presenting growth that did not exist.'),
      ),
      seo: {
        titulo: 'The growth that wasn’t there',
        descripcion: 'A +33% that was really +10%: how unrecorded months inflated the growth of a supermarket chain in Ecuador.',
      },
    },
  },
  {
    proyecto: 'pork-to-china',
    fecha: '2026-11-19',
    portadaRuta: '/proyectos/pork/recomendacion.webp',
    etiquetas: ['Inteligencia comercial', 'Análisis de datos', 'Finanzas'],
    es: {
      titulo: 'Un «todavía no» también es una buena respuesta',
      slug: 'un-todavia-no-tambien-es-una-buena-respuesta',
      resumen: 'La guerra comercial abrió un espacio en el cerdo que compra China. Con datos públicos, la respuesta para Ecuador fue «todavía no», y eso es útil si dice qué tendría que cambiar.',
      portadaAlt: 'Página de recomendación del tablero de Pork to China: «no invertir hoy», con los disparadores y su estado actual.',
      contenido: doc(
        p('En Pork to China me hice una pregunta de inteligencia comercial: ¿puede una empresa porcina ecuatoriana aprovechar los aranceles de China al cerdo de EE. UU. y Europa? La trabajé con datos públicos y una empresa ficticia, AgroPorc Ecuador.'),
        h3('La ventana existe'),
        p('Tras los aranceles de 2025, EE. UU. pasó de 28,7 % a 22,8 % de las vísceras de cerdo que compra China. Ese espacio lo tomaron España, Reino Unido y Dinamarca. Pero las ventanas así se cierran: en 2018 EE. UU. perdió 9,6 puntos y en 2020, con la Fase Uno, recuperó 10,2.'),
        h3('Pero los números no dan'),
        ul([
          'Ecuador no tiene permiso sanitario: la OMSA solo reconoce a Galápagos como libre de peste porcina clásica.',
          'Aun con permiso, China paga 1,47 USD por kilo, la víscera ya vale 1,38 en Ecuador y llevarla cuesta 0,25 más: −0,16 USD por kilo.',
          'El valor actual neto es negativo en los 24 escenarios modelados, y el Monte Carlo da entre 1 % y 11 % de probabilidad de ganar.',
        ]),
        h3('Por qué «no» no es suficiente'),
        p('Un «no invertir» sin más no le sirve a nadie: la situación cambia. Por eso la recomendación es «todavía no» y viene con disparadores medibles. El proyecto empieza a ganar si la víscera en planta baja a 1,14 USD/kg o si el precio de referencia en China sube a 1,84; y además hacen falta una zona libre de peste porcina clásica y un protocolo sanitario con China. El tablero recalcula esos disparadores en cada corrida.'),
        h3('El supuesto que más pesa'),
        p('De 12 supuestos, uno pesa más que todos los demás juntos: cuánto vale la víscera en Ecuador. Por eso la primera acción recomendada no es más código, sino llamar a dos o tres camales y preguntar el precio real. A veces el análisis más valioso es el que te dice qué dato salir a buscar.'),
      ),
      seo: {
        titulo: 'Un «todavía no» también es una buena respuesta',
        descripcion: '¿Puede Ecuador venderle cerdo a China por la guerra comercial? 24 escenarios, margen de −0,16 USD/kg y disparadores para revisar la decisión.',
      },
    },
    en: {
      titulo: 'A “not yet” is a good answer too',
      slug: 'a-not-yet-is-a-good-answer-too',
      resumen: 'The trade war opened a gap in the pork China buys. With public data, the answer for Ecuador was “not yet”, and that is useful as long as it says what would have to change.',
      portadaAlt: 'Recommendation page of the Pork to China dashboard: “do not invest today”, with the triggers and their current status.',
      contenido: doc(
        p('In Pork to China I asked a trade-intelligence question: can an Ecuadorian pork company take advantage of China’s tariffs on US and European pork? I worked it out with public data and a fictitious company, AgroPorc Ecuador.'),
        h3('The window is real'),
        p('After the 2025 tariffs, the US went from 28.7% to 22.8% of the pork offal China buys. Spain, the UK and Denmark took that space. But windows like this close: in 2018 the US lost 9.6 points and in 2020, with Phase One, it won back 10.2.'),
        h3('But the numbers don’t add up'),
        ul([
          'Ecuador has no sanitary access: the WOAH recognizes only the Galápagos as free of classical swine fever.',
          'Even with access, China pays 1.47 USD per kilo, the offal is already worth 1.38 in Ecuador and shipping it costs 0.25 more: −0.16 USD per kilo.',
          'Net present value is negative in all 24 modeled scenarios, and the Monte Carlo gives a 1% to 11% chance of making money.',
        ]),
        h3('Why “no” is not enough'),
        p('A flat “don’t invest” helps nobody: the situation changes. That is why the recommendation is “not yet” and comes with measurable triggers. The project starts to make money if offal at the plant drops to 1.14 USD/kg or if the reference price in China rises to 1.84; and it also needs a zone free of classical swine fever and a sanitary protocol with China. The dashboard recomputes those triggers on every run.'),
        h3('The assumption that matters most'),
        p('Out of 12 assumptions, one outweighs all the others combined: what the offal is worth in Ecuador. That is why the first recommended action is not more code, but calling two or three slaughterhouses and asking for the real price. Sometimes the most valuable analysis is the one that tells you which data to go and find.'),
      ),
      seo: {
        titulo: 'A “not yet” is a good answer too',
        descripcion: 'Can Ecuador sell pork to China because of the trade war? 24 scenarios, a −0.16 USD/kg margin and triggers to revisit the decision.',
      },
    },
  },
]

async function main() {
  const payload = await getPayload({ config })
  const cambios: string[] = []

  for (const a of ARTICULOS) {
    const proyecto = (
      await payload.find({ collection: 'proyectos', locale: 'es', where: { slug: { equals: a.proyecto } }, limit: 1, depth: 0 })
    ).docs[0]
    let art = (
      await payload.find({ collection: 'articulos', locale: 'es', where: { slug: { equals: a.es.slug } }, limit: 1, depth: 0 })
    ).docs[0] as unknown as Rec | undefined
    if (!art) {
      art = (await payload.create({
        collection: 'articulos',
        locale: 'es',
        data: {
          publicado: true,
          fecha: a.fecha,
          portadaRuta: a.portadaRuta,
          etiquetas: a.etiquetas,
          proyecto: proyecto?.id ?? null,
          ...a.es,
        } as never,
      })) as unknown as Rec
      cambios.push(`Artículo creado y publicado: ${a.es.titulo}`)
    }
    const id = art.id as number
    const en = (await payload.findByID({ collection: 'articulos', id, locale: 'en', fallbackLocale: false, depth: 0 })) as unknown as Rec
    const d: Rec = {}
    for (const campo of ['titulo', 'slug', 'resumen', 'portadaAlt'] as const) if (vacio(en[campo])) d[campo] = a.en[campo]
    if (vacio(en.contenido) || !/"text":"[^"]*\S/.test(JSON.stringify(en.contenido ?? ''))) d.contenido = a.en.contenido
    const seo = (en.seo ?? {}) as Rec
    if (vacio(seo.titulo)) d.seo = a.en.seo
    if (PUBLICAR_INGLES && en.publicado !== true) d.publicado = true
    if (Object.keys(d).length > 0) {
      await payload.update({ collection: 'articulos', id, locale: 'en', data: d as never })
      cambios.push(`Artículo (EN) ${a.en.slug}: ${Object.keys(d).join(', ')}`)
    }
  }

  console.log(cambios.length ? `Cambios:\n- ${cambios.join('\n- ')}` : 'Sin cambios: todo estaba al día.')
  process.exit(0)
}

main().catch((e) => {
  console.error('Contenido v11 falló:', e instanceof Error ? e.message : e)
  process.exit(1)
})
