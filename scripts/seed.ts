/**
 * Seed inicial con el contenido CONFIRMADO por Carlos.
 * - Español: completo y publicado.
 * - Inglés: borrador SIN publicar (casilla "Publicado en este idioma" desmarcada). Carlos lo revisa y lo publica.
 * - Enlaces de verificación: solo desde seed.private.json (ignorado por git), nunca en este archivo.
 * Uso: pnpm seed            (no borra nada si ya hay contenido)
 *      pnpm seed --reset    (vacía las colecciones de contenido y vuelve a cargar; NO toca usuarios ni mensajes)
 */
import 'dotenv/config'
import { existsSync, readFileSync } from 'node:fs'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { doc, h3, p, ul } from './lexical'

type Privado = { verificacion?: Record<string, string> }
const privado: Privado = existsSync('seed.private.json')
  ? JSON.parse(readFileSync('seed.private.json', 'utf8'))
  : {}
const verif = (clave: string) => privado.verificacion?.[clave] || undefined

const CONTENIDO = ['proyectos', 'trayectoria', 'formacion', 'certificaciones', 'servicios', 'idiomas'] as const

async function main() {
  const payload = await getPayload({ config })
  const reset = process.argv.includes('--reset')

  const existentes = await payload.count({ collection: 'proyectos' })
  if (existentes.totalDocs > 0 && !reset) {
    console.log('Ya hay contenido. Usa --reset para recargar (no toca usuarios ni mensajes).')
    process.exit(0)
  }
  if (reset) for (const c of CONTENIDO) await payload.delete({ collection: c, where: { id: { exists: true } } })

  /** Crea en español (publicado) y añade el borrador en inglés (sin publicar). */
  async function crear<T extends Record<string, unknown>>(collection: (typeof CONTENIDO)[number], es: T, en?: Partial<T>) {
    const d = await payload.create({ collection, locale: 'es', data: { ...es, publicado: true } as never })
    if (en) await payload.update({ collection, id: d.id, locale: 'en', data: { ...en, publicado: false } as never })
    return d
  }

  // ——— Perfil ———
  await payload.updateGlobal({
    slug: 'perfil',
    locale: 'es',
    data: {
      nombrePublico: 'Carlos Romero',
      nombreCompleto: 'Carlos Eduardo Romero Huerta',
      titular: 'Analista de datos e ingeniero de datos',
      presentacion:
        'Soy ingeniero en Tecnologías de la Información por la Universidad de Guayaquil. Trabajo por proyectos en análisis de datos, Business Intelligence y automatización de procesos.',
      sobreMi: doc(
        p('Soy Carlos Romero, ingeniero en Tecnologías de la Información por la Universidad de Guayaquil (2024). Me enfoco en Business Intelligence, ciencia de datos y automatización de procesos.'),
        p('Completé el programa Data-Driven Decisions Specialist en Coding Bootcamp (ESPOL). Desde 2025 trabajo de forma independiente, por proyectos.'),
        p('Antes fui docente en la Unidad Educativa Nueva Visión de Guayaquil, donde enseñé inglés, matemáticas y computación.'),
      ),
      ubicacion: 'Guayaquil, Ecuador',
      github: 'https://github.com/CarlosRomero55',
      disponible: true,
      seo: {
        titulo: 'Carlos Romero — Análisis e ingeniería de datos',
        descripcion: 'Portafolio de Carlos Romero, analista e ingeniero de datos en Guayaquil, Ecuador.',
      },
    },
  })

  // ——— Textos del sitio: aviso de privacidad (borrador; Carlos debe revisarlo) ———
  await payload.updateGlobal({
    slug: 'textosSitio',
    locale: 'es',
    data: {
      avisoPrivacidad: doc(
        p('Este aviso explica qué datos recojo a través de este sitio, para qué los uso y cómo puedes ejercer tus derechos, conforme a la Ley Orgánica de Protección de Datos Personales del Ecuador.'),
        h3('Qué datos recojo'),
        p('Solo los que escribes en el formulario de contacto: nombre, apellido, correo electrónico, país, teléfono (opcional), área de interés y mensaje, además del idioma de la página desde la que escribes.'),
        h3('Para qué los uso'),
        p('Únicamente para responder tu mensaje. No los vendo, no los cedo a terceros con fines comerciales y no te envío publicidad.'),
        h3('Cuánto tiempo los conservo'),
        p('Hasta 12 meses desde el envío, o antes si me pides borrarlos. Para evitar envíos abusivos guardo durante 24 horas un código derivado de tu dirección IP; la IP en sí no se guarda.'),
        h3('Proveedores que intervienen'),
        ul([
          'Vercel: alojamiento del sitio.',
          'Neon: base de datos donde se guarda tu mensaje.',
          'Resend: envío del aviso interno por correo.',
          'Cloudflare Turnstile: verificación de que no eres un robot.',
        ]),
        h3('Cookies y analítica'),
        p('Este sitio no usa cookies de seguimiento ni herramientas de analítica.'),
        h3('Tus derechos'),
        p('Puedes pedir acceso, rectificación o eliminación de tus datos a través del mismo formulario de contacto, eligiendo el área “Otro”.'),
      ),
      pie: '',
    },
  })

  // ——— Trayectoria ———
  const freelance = await crear(
    'trayectoria',
    {
      orden: 1,
      cargo: 'Analista de datos independiente (freelance)',
      organizacion: 'Proyectos por cuenta propia',
      periodo: '2025 – actualidad',
      descripcion: 'Proyectos de análisis de datos, Business Intelligence y automatización de procesos.',
    },
    {
      cargo: 'Freelance data analyst',
      organizacion: 'Independent projects',
      periodo: '2025 – present',
      descripcion: 'Data analysis, Business Intelligence and process automation projects.',
    },
  )
  await crear(
    'trayectoria',
    {
      orden: 2,
      cargo: 'Contrato freelance — área de Eventos',
      organizacion: 'Cervecería Nacional',
      etapaPadre: freelance.id,
    },
    { cargo: 'Freelance contract — Events department', organizacion: 'Cervecería Nacional' },
  )
  const docente = await crear(
    'trayectoria',
    {
      orden: 3,
      cargo: 'Docente de matemáticas y computación',
      organizacion: 'Unidad Educativa Nueva Visión, Guayaquil',
      periodo: '2018 – 2020',
    },
    {
      cargo: 'Mathematics and computer science teacher',
      organizacion: 'Unidad Educativa Nueva Visión, Guayaquil',
      periodo: '2018 – 2020',
    },
  )
  await crear(
    'trayectoria',
    {
      orden: 4,
      cargo: 'Docente de inglés',
      organizacion: 'Unidad Educativa Nueva Visión, Guayaquil',
      periodo: '2017 – 2018',
      breve: true,
      etapaPadre: docente.id,
    },
    { cargo: 'English teacher', organizacion: 'Unidad Educativa Nueva Visión, Guayaquil', periodo: '2017 – 2018' },
  )

  // ——— Formación ———
  await crear(
    'formacion',
    {
      orden: 1,
      tipo: 'titulo',
      nombre: 'Ingeniería en Tecnologías de la Información',
      institucion: 'Universidad de Guayaquil',
      anio: '2024',
      nombreEnCredencial: 'Carlos Eduardo Romero Huerta',
      verificacionInterna: verif('ingenieria-ti'),
    },
    { nombre: 'Bachelor’s degree in Information Technology Engineering' },
  )
  await crear(
    'formacion',
    {
      orden: 2,
      tipo: 'bootcamp',
      nombre: 'Data-Driven Decisions Specialist',
      institucion: 'Coding Bootcamp — ESPOL',
      detalle: '12 semanas, más de 50 horas',
      verificacionInterna: verif('ddds-espol'),
    },
    { nombre: 'Data-Driven Decisions Specialist', detalle: '12 weeks, 50+ hours' },
  )

  // ——— Certificaciones (nombre oficial, no se traduce) ———
  await crear('certificaciones', {
    orden: 1,
    nombre: 'Microsoft Certified: Fabric Data Engineer Associate (DP-700)',
    emisor: 'Microsoft',
    plataforma: 'Microsoft Learn',
    estado: 'en_preparacion',
    verificacionInterna: verif('dp-700'),
  })
  // Inglés también publicado: el nombre oficial es igual en ambos idiomas.
  const certs = await payload.find({ collection: 'certificaciones', limit: 10 })
  for (const c of certs.docs) await payload.update({ collection: 'certificaciones', id: c.id, locale: 'en', data: { publicado: true } })

  // ——— Idiomas ———
  await crear('idiomas', { orden: 1, idioma: 'Español', nivel: 'Nativo' }, { idioma: 'Spanish', nivel: 'Native' })
  await crear(
    'idiomas',
    { orden: 2, idioma: 'Inglés', nivel: 'B2 — intermedio alto (EF SET)' },
    { idioma: 'English', nivel: 'B2 — upper intermediate (EF SET)' },
  )

  // ——— Servicios ———
  await crear(
    'servicios',
    {
      orden: 1,
      nombre: 'Análisis de datos y Business Intelligence',
      descripcion: 'Dashboards e indicadores en Power BI que responden preguntas concretas del negocio.',
      herramientas: ['Power BI', 'SQL', 'Excel'],
    },
    {
      nombre: 'Data analysis and Business Intelligence',
      descripcion: 'Power BI dashboards and KPIs that answer specific business questions.',
    },
  )
  await crear(
    'servicios',
    {
      orden: 2,
      nombre: 'Ingeniería de datos',
      descripcion: 'Modelos de datos por capas y procesos ETL que dejan la información limpia y lista para analizar.',
      herramientas: ['Python', 'Pandas', 'MySQL'],
    },
    {
      nombre: 'Data engineering',
      descripcion: 'Layered data models and ETL processes that leave data clean and ready to analyze.',
    },
  )
  await crear(
    'servicios',
    {
      orden: 3,
      nombre: 'Automatización de procesos',
      descripcion: 'Automatización de reportes y tareas repetitivas con datos.',
      herramientas: ['Python', 'Excel'],
    },
    { nombre: 'Process automation', descripcion: 'Automation of reports and repetitive data tasks.' },
  )

  // ——— Proyecto: Shrimp Intelligence Ecuador ———
  // Texto cualitativo, SIN cifras: Carlos debe revisar la pregunta de negocio y completar resultados y fuentes.
  await crear(
    'proyectos',
    {
      orden: 1,
      titulo: 'Shrimp Intelligence Ecuador',
      slug: 'shrimp-intelligence-ecuador',
      area: 'ambos',
      tecnologias: ['MySQL', 'Python', 'Power BI'],
      resumen:
        'Análisis de las exportaciones de camarón de Ecuador con un modelo de datos por capas (Medallion) en MySQL, procesamiento en Python y un dashboard en Power BI.',
      preguntaNegocio:
        '¿Cómo han evolucionado las exportaciones ecuatorianas de camarón y qué mercados explican ese comportamiento?',
      problema: doc(
        p('El camarón es uno de los principales productos de exportación de Ecuador, pero la información pública sobre sus exportaciones está repartida en distintas fuentes y formatos, lo que dificulta compararla en el tiempo y entre mercados.'),
      ),
      datosLimpieza: doc(
        p('Reuní datos de fuentes oficiales y los cargué sin cambios en una capa de entrada. Después unifiqué formatos de fecha, nombres de países y unidades, y eliminé registros duplicados o incompletos.'),
        p('Cada cifra oficial se cita con su fuente y fecha de consulta. Los gráficos de esta página usan datos simulados.'),
      ),
      metodo: doc(
        p('Organicé los datos en MySQL con una arquitectura Medallion de tres capas:'),
        ul([
          'Bronze: datos originales, tal como vienen de la fuente.',
          'Silver: datos limpios y estandarizados.',
          'Gold: tablas listas para el análisis, agregadas por periodo y mercado.',
        ]),
        p('Con Python automaticé la transformación entre capas y las validaciones. El resultado alimenta un dashboard en Power BI.'),
      ),
      resultado: doc(
        p('Un dashboard en Power BI que permite seguir la evolución de las exportaciones y compararlas por mercado y periodo, alimentado por un modelo de datos reproducible.'),
      ),
      aprendizajes: doc(
        p('Separar los datos en capas facilita encontrar el origen de un error y volver a procesar solo lo necesario. Documentar cada fuente con su fecha de consulta es clave para que el análisis se pueda verificar.'),
      ),
      graficos: [{ archivo: 'camaron-exportaciones', titulo: 'Índice mensual de volumen exportado' }],
      contieneDatosSimulados: true,
      seo: {
        titulo: 'Shrimp Intelligence Ecuador — exportaciones de camarón',
        descripcion: 'Proyecto de análisis e ingeniería de datos: MySQL con arquitectura Medallion, Python y Power BI.',
      },
      notasInternas:
        'Revisar: pregunta de negocio, resultado (sin cifras hasta confirmarlas) y agregar fuentes con fecha de consulta. Repositorio privado: no enlazar aún.',
    },
    {
      titulo: 'Shrimp Intelligence Ecuador',
      slug: 'shrimp-intelligence-ecuador',
      resumen:
        'Analysis of Ecuador’s shrimp exports with a layered (Medallion) data model in MySQL, Python processing and a Power BI dashboard.',
      preguntaNegocio: 'How have Ecuador’s shrimp exports evolved, and which markets explain that behavior?',
      problema: doc(
        p('Shrimp is one of Ecuador’s main export products, but public data on its exports is spread across different sources and formats, which makes comparisons over time and across markets difficult.'),
      ),
      datosLimpieza: doc(
        p('I gathered data from official sources and loaded it unchanged into an input layer. Then I unified date formats, country names and units, and removed duplicate or incomplete records.'),
        p('Each official figure is cited with its source and access date. The charts on this page use simulated data.'),
      ),
      metodo: doc(
        p('I organized the data in MySQL using a three-layer Medallion architecture:'),
        ul([
          'Bronze: raw data, as delivered by the source.',
          'Silver: clean, standardized data.',
          'Gold: analysis-ready tables aggregated by period and market.',
        ]),
        p('I used Python to automate the transformations between layers and the validations. The result feeds a Power BI dashboard.'),
      ),
      resultado: doc(
        p('A Power BI dashboard to track how exports evolve and compare them by market and period, powered by a reproducible data model.'),
      ),
      aprendizajes: doc(
        p('Splitting data into layers makes it easier to trace the origin of an error and reprocess only what is needed. Documenting each source with its access date is key to making the analysis verifiable.'),
      ),
      seo: {
        titulo: 'Shrimp Intelligence Ecuador — shrimp exports',
        descripcion: 'Data analysis and engineering project: MySQL with a Medallion architecture, Python and Power BI.',
      },
    },
  )

  // Título EN del gráfico: se actualiza la misma fila (conservar id) para no perder el título ES.
  const [shrimp] = (await payload.find({ collection: 'proyectos', locale: 'es', limit: 1 })).docs
  if (shrimp?.graficos?.length) {
    await payload.update({
      collection: 'proyectos',
      id: shrimp.id,
      locale: 'en',
      data: { graficos: shrimp.graficos.map((g) => ({ id: g.id, archivo: g.archivo, titulo: 'Monthly export volume index' })) },
    })
  }

  console.log('Seed completo. Español publicado; inglés en borrador (sin publicar).')
  process.exit(0)
}

main().catch((e) => {
  console.error('Seed falló:', e instanceof Error ? e.message : e)
  process.exit(1)
})
