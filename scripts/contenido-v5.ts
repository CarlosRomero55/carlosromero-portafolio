/**
 * Contenido v5 (13 nov 2026): igualar la página al CV de Carlos (CARLOS_ROMERO_CV.pdf).
 *
 * Decisiones de Carlos: la experiencia de la página es la del CV; el PDF se sigue generando
 * desde el panel, sin correo ni teléfono.
 *  - Trayectoria: crea las 3 etapas del CV. Las etapas anteriores se OCULTAN (no se borran):
 *    se pueden volver a publicar desde el panel.
 *  - Certificaciones: PL-300, Excel Associate y SQL (DataCamp), obtenidas. DP-700 sigue en preparación.
 *  - Formación: años del CV si el campo sigue con el valor anterior.
 *  - Inglés: el texto viene del CV (inglés); se publica en /en solo con PUBLICAR_INGLES=true, como siempre.
 * Idempotente: no vuelve a crear ni a ocultar nada si ya lo hizo. Uso: pnpm contenido:v5
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

type Rec = Record<string, unknown>
const PUBLICAR_INGLES = process.env.PUBLICAR_INGLES === 'true'

const ETAPAS = [
  {
    orden: 1,
    es: {
      cargo: 'Consultor independiente en Análisis de Datos y Business Intelligence',
      organizacion: 'Independiente',
      periodo: '2025 – actualidad',
      descripcion: [
        'Diseñé y puse en marcha el pipeline ETL y los dashboards ejecutivos en Power BI para una clínica privada: eliminé procesos manuales en Excel y reduje en 50 % el tiempo de generación de reportes.',
        'Automaticé la extracción y consolidación de datos de varias fuentes web con Python y Selenium para una firma contable: redujo en 40 % el tiempo operativo manual y dio acceso a datos en tiempo real a más de 8 personas del equipo.',
        'Hice análisis exploratorio y modelado relacional en SQL Server para más de 3 conjuntos de datos de clientes, encontrando patrones de comportamiento y problemas de calidad de datos que guiaron mejoras de procesos.',
      ].join('\n'),
    },
    en: {
      cargo: 'Independent Data Analytics & Business Intelligence Consultant',
      organizacion: 'Self-employed',
      periodo: '2025 – present',
      descripcion: [
        'Designed and deployed a complete ETL pipeline and executive dashboards in Power BI for a private clinic, eliminating manual Excel processes and reducing report generation time by 50%.',
        'Automated large-scale data extraction and consolidation from multiple web sources using Python and Selenium for an accounting firm, cutting manual operational time by 40% and enabling real-time data access for 8+ team members.',
        'Conducted exploratory data analysis and relational modeling in SQL Server for 3+ client datasets, identifying behavioral patterns and data quality issues that informed process improvements.',
      ].join('\n'),
    },
  },
  {
    orden: 2,
    es: {
      cargo: 'QA de Software y Automatización de Datos',
      organizacion: 'Globant',
      periodo: 'ago. 2024 – ene. 2025',
      descripcion: [
        'Ejecuté gobierno, validación y aseguramiento de calidad de datos en flujos críticos de aplicaciones, garantizando 100 % de consistencia e integridad en más de 5 pipelines de producción antes de cada despliegue.',
        'Desarrollé scripts de pruebas automatizadas en Python con Pytest y Selenium: aumentaron en 35 % la efectividad de la validación de datos y bajaron las pruebas manuales de 4 a 2,5 horas por versión.',
        'Trabajé con equipos de distintas áreas para documentar estándares de calidad de datos e implementar protocolos de validación para sistemas de origen y de destino.',
      ].join('\n'),
    },
    en: {
      cargo: 'QA Software & Data Automation Engineer',
      organizacion: 'Globant',
      periodo: 'Aug 2024 – Jan 2025',
      descripcion: [
        'Executed data governance, validation, and quality assurance within critical application workflows, ensuring 100% data consistency and integrity across 5+ production pipelines before deployment.',
        'Developed and deployed automated Python testing scripts using Pytest and Selenium frameworks, increasing data validation effectiveness by 35% and reducing manual testing cycles from 4 hours to 2.5 hours per release.',
        'Collaborated with cross-functional teams to document data quality standards and implement validation protocols for upstream and downstream systems.',
      ].join('\n'),
    },
  },
  {
    orden: 3,
    es: {
      cargo: 'Trainee de Ciencia de Datos',
      organizacion: 'Clínica Palacios Dental',
      periodo: 'jul. 2023 – jul. 2024',
      descripcion: [
        'Gestioné, limpié y aseguré la calidad de un conjunto de más de 50 000 registros dentales e imágenes médicas almacenados en Google Cloud Storage (GCP), con técnicas avanzadas de validación de datos.',
        'Entrené y optimicé modelos de clasificación en TensorFlow con 85 % de precisión, resolviendo inconsistencias en el etiquetado de datos y permitiendo la categorización automática de imágenes en los flujos clínicos.',
        'Desarrollé interfaces interactivas de validación y análisis de datos en tiempo real con Streamlit, para que el equipo especializado revisara las predicciones del modelo y las métricas de calidad sin carga técnica.',
      ].join('\n'),
    },
    en: {
      cargo: 'Data Science Trainee',
      organizacion: 'Clínica Palacios Dental',
      periodo: 'Jul 2023 – Jul 2024',
      descripcion: [
        'Managed, cleaned, and ensured quality assurance for a dataset of 50,000+ dental records and medical images stored in Google Cloud Storage (GCP), applying advanced data validation techniques.',
        'Trained and optimized TensorFlow classification models achieving 85% precision, resolving complex data labeling inconsistencies and enabling automated image categorization for clinical workflows.',
        'Developed interactive real-time data validation and analysis interfaces using Streamlit, enabling the specialized team to review model predictions and data quality metrics without technical overhead.',
      ].join('\n'),
    },
  },
] as const

const CERTIFICACIONES = [
  { orden: 1, nombre: 'Microsoft Certified: Power BI Data Analyst Associate (PL-300)', emisor: 'Microsoft', anio: '2026' },
  { orden: 2, nombre: 'Microsoft Office Specialist: Excel Associate (Microsoft 365)', emisor: 'Microsoft', anio: '2026' },
  { orden: 3, nombre: 'SQL Certified Specialist', emisor: 'DataCamp', anio: '2023' },
]

async function main() {
  const payload = await getPayload({ config })
  const cambios: string[] = []

  // ——— Trayectoria ———
  const todas = (await payload.find({ collection: 'trayectoria', locale: 'es', limit: 100, depth: 0 })).docs as unknown as Rec[]
  const yaCreada = (cargo: string) => todas.find((d) => d.cargo === cargo)
  const nuevas: number[] = []
  let primeraVez = false
  for (const e of ETAPAS) {
    let doc = yaCreada(e.es.cargo)
    if (!doc) {
      primeraVez = true
      doc = (await payload.create({
        collection: 'trayectoria',
        locale: 'es',
        data: { ...e.es, orden: e.orden, publicado: true } as never,
      })) as unknown as Rec
      await payload.update({ collection: 'trayectoria', id: doc.id as number, locale: 'en', data: { ...e.en, publicado: false } as never })
      cambios.push(`Trayectoria: creada «${e.es.cargo}»`)
    }
    nuevas.push(doc.id as number)
    if (PUBLICAR_INGLES) {
      const en = (await payload.findByID({ collection: 'trayectoria', id: doc.id as number, locale: 'en', fallbackLocale: false, depth: 0 })) as unknown as Rec
      if (en.publicado !== true) {
        await payload.update({ collection: 'trayectoria', id: doc.id as number, locale: 'en', data: { publicado: true } as never })
        cambios.push(`Trayectoria (EN): publicada «${e.en.cargo}»`)
      }
    }
  }
  // Solo la primera vez: ocultar las etapas anteriores (no se borran).
  if (primeraVez) {
    for (const d of todas) {
      if (nuevas.includes(d.id as number)) continue
      for (const locale of ['es', 'en'] as const) {
        await payload.update({ collection: 'trayectoria', id: d.id as number, locale, data: { publicado: false } as never })
      }
      cambios.push(`Trayectoria: oculta «${String(d.cargo)}» (sigue en el panel)`)
    }
  }

  // ——— Certificaciones ———
  const certs = (await payload.find({ collection: 'certificaciones', locale: 'es', limit: 100, depth: 0 })).docs as unknown as Rec[]
  for (const c of CERTIFICACIONES) {
    if (certs.some((d) => d.nombre === c.nombre)) continue
    const nueva = await payload.create({
      collection: 'certificaciones',
      locale: 'es',
      data: { ...c, estado: 'obtenida', publicado: true } as never,
    })
    // El nombre oficial no se traduce: se publica igual en inglés.
    await payload.update({ collection: 'certificaciones', id: nueva.id, locale: 'en', data: { publicado: true } as never })
    cambios.push(`Certificación: ${c.nombre}`)
  }
  const dp700 = certs.find((d) => String(d.nombre).includes('DP-700'))
  if (dp700 && (dp700.orden === 1 || dp700.orden == null)) {
    await payload.update({ collection: 'certificaciones', id: dp700.id as number, locale: 'es', data: { orden: 4 } as never })
    cambios.push('Certificación DP-700: va al final (en preparación)')
  }

  // ——— Formación: años del CV ———
  const formacion = (await payload.find({ collection: 'formacion', locale: 'es', limit: 100, depth: 0 })).docs as unknown as Rec[]
  for (const f of formacion) {
    if (f.institucion === 'Universidad de Guayaquil' && f.anio === '2024') {
      await payload.update({ collection: 'formacion', id: f.id as number, locale: 'es', data: { anio: '2019 – 2024' } as never })
      cambios.push('Formación UG: 2019 – 2024')
    }
    if (String(f.institucion).includes('ESPOL') && (f.anio == null || f.anio === '')) {
      await payload.update({ collection: 'formacion', id: f.id as number, locale: 'es', data: { anio: '2025' } as never })
      cambios.push('Formación ESPOL: 2025')
    }
  }

  console.log(cambios.length ? `Cambios:\n- ${cambios.join('\n- ')}` : 'Sin cambios: todo estaba al día.')
  process.exit(0)
}

main().catch((e) => {
  console.error('Contenido v5 falló:', e instanceof Error ? e.message : e)
  process.exit(1)
})
