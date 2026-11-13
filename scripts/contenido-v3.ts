/**
 * Contenido v3 (13 nov 2026): inglés de todo el contenido + primer artículo (fase 6).
 *
 * Reglas (iguales a v2):
 *  - Solo llena campos vacíos o textos que siguen exactamente como los dejó el seed. Nunca borra.
 *  - El inglés de proyectos, servicios, trayectoria, formación e idiomas queda SIN PUBLICAR,
 *    salvo que se ejecute con PUBLICAR_INGLES=true (lo decide Carlos tras revisarlo).
 *  - El artículo queda SIN PUBLICAR, salvo PUBLICAR_ARTICULO=true.
 *  - Perfil y Textos del sitio no tienen casilla de publicación: su inglés se llena si está vacío.
 * Uso: pnpm contenido:v3
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { doc, h3, p, ul } from './lexical'

type Rec = Record<string, unknown>
type Col = 'proyectos' | 'servicios' | 'trayectoria' | 'formacion' | 'idiomas' | 'articulos'

const PUBLICAR_INGLES = process.env.PUBLICAR_INGLES === 'true'
const PUBLICAR_ARTICULO = process.env.PUBLICAR_ARTICULO === 'true'

const vacio = (v: unknown) =>
  v === null || v === undefined || v === '' || (Array.isArray(v) && v.length === 0) ||
  (typeof v === 'object' && v !== null && 'root' in v && !/"text":"[^"]*\S/.test(JSON.stringify(v)))
const empiezaCon = (actual: unknown, inicio: string) =>
  typeof actual === 'string' ? actual.startsWith(inicio) : JSON.stringify(actual ?? '').includes(inicio)

async function main() {
  const payload = await getPayload({ config })
  const cambios: string[] = []

  const leer = async (collection: Col, id: number | string, locale: 'es' | 'en') =>
    (await payload.findByID({ collection, id, locale, fallbackLocale: false, depth: 0 })) as unknown as Rec
  async function guardar(collection: Col, id: number | string, data: Rec, etiqueta: string) {
    if (Object.keys(data).length === 0) return
    await payload.update({ collection, id, locale: 'en', data: data as never })
    cambios.push(`${etiqueta} (EN): ${Object.keys(data).join(', ')}`)
  }
  /** Campo de texto EN: se llena si está vacío o si sigue igual al borrador del seed. */
  function texto(d: Rec, en: Rec, campo: string, valor: unknown, seedEn?: string) {
    if (JSON.stringify(en[campo]) === JSON.stringify(valor)) return
    if (vacio(en[campo]) || (seedEn && empiezaCon(en[campo], seedEn))) d[campo] = valor
  }
  /**
   * Arreglo con subcampos localizados: se conservan los id de las filas (los comparte el español)
   * y se traduce cada fila reconocida por su texto en español. Filas desconocidas no se tocan.
   */
  function filas(d: Rec, es: Rec, en: Rec, campo: string, clave: string, mapa: Record<string, Rec>) {
    const filasEs = Array.isArray(es[campo]) ? (es[campo] as Rec[]) : []
    const filasEn = Array.isArray(en[campo]) ? (en[campo] as Rec[]) : []
    if (filasEs.length === 0) return
    let cambia = false
    const nuevas = filasEs.map((fila, i) => {
      const actualEn = filasEn[i] ?? {}
      const trad = mapa[String(fila[clave] ?? '')]
      const base = { ...actualEn, id: fila.id }
      if (!trad) return base
      const faltan = Object.keys(trad).some((k) => vacio(actualEn[k]))
      if (!faltan) return base
      cambia = true
      return { ...base, ...Object.fromEntries(Object.entries(trad).map(([k, v]) => [k, vacio(actualEn[k]) ? v : actualEn[k]])) }
    })
    if (cambia) d[campo] = nuevas
  }

  // ——— Perfil (global) ———
  const perfilEn = (await payload.findGlobal({ slug: 'perfil', locale: 'en', fallbackLocale: false })) as unknown as Rec
  const perfil: Rec = {}
  texto(perfil, perfilEn, 'titular', 'Data analyst and data engineer')
  texto(perfil, perfilEn, 'presentacion', 'I am an Information Technology engineer from the University of Guayaquil. I work on a project basis in data analysis, Business Intelligence and process automation.')
  texto(perfil, perfilEn, 'sobreMi', doc(
    p('I am Carlos Romero, an Information Technology engineer from the University of Guayaquil (2024). I focus on Business Intelligence, data science and process automation.'),
    p('I completed the Data-Driven Decisions Specialist program at Coding Bootcamp (ESPOL). Since 2025 I have worked independently, on a project basis.'),
    p('Before that I was a teacher at Unidad Educativa Nueva Visión in Guayaquil, where I taught English, mathematics and computer science.'),
  ))
  texto(perfil, perfilEn, 'ubicacion', 'Guayaquil, Ecuador')
  const seoEn = (perfilEn.seo ?? {}) as Rec
  if (vacio(seoEn.titulo) && vacio(seoEn.descripcion)) {
    perfil.seo = {
      titulo: 'Carlos Romero — Data analysis and engineering',
      descripcion: 'Portfolio of Carlos Romero, data analyst and data engineer based in Guayaquil, Ecuador.',
    }
  }
  if (Object.keys(perfil).length) {
    await payload.updateGlobal({ slug: 'perfil', locale: 'en', data: perfil as never })
    cambios.push(`Perfil (EN): ${Object.keys(perfil).join(', ')}`)
  }

  // ——— Textos del sitio: aviso de privacidad ———
  const textosEs = (await payload.findGlobal({ slug: 'textosSitio', locale: 'es', fallbackLocale: false })) as unknown as Rec
  const FRASE_VIEJA = 'Este sitio no usa cookies de seguimiento ni herramientas de analítica.'
  if (JSON.stringify(textosEs.avisoPrivacidad ?? '').includes(FRASE_VIEJA)) {
    // La analítica sin cookies se describe aparte (bloque automático cuando se activa).
    const nuevo = JSON.parse(JSON.stringify(textosEs.avisoPrivacidad).replace(FRASE_VIEJA, 'Este sitio no usa cookies de seguimiento.'))
    await payload.updateGlobal({ slug: 'textosSitio', locale: 'es', data: { avisoPrivacidad: nuevo } })
    cambios.push('Aviso de privacidad (ES): frase de cookies actualizada para la analítica sin cookies')
  }
  const textosEn = (await payload.findGlobal({ slug: 'textosSitio', locale: 'en', fallbackLocale: false })) as unknown as Rec
  if (vacio(textosEn.avisoPrivacidad)) {
    await payload.updateGlobal({
      slug: 'textosSitio',
      locale: 'en',
      data: {
        avisoPrivacidad: doc(
          p('This notice explains what data I collect through this site, what I use it for and how you can exercise your rights, in line with Ecuador’s Organic Law on Personal Data Protection.'),
          h3('What data I collect'),
          p('Only what you type in the contact form: first name, last name, email, country, phone (optional), area of interest and message, plus the language of the page you write from.'),
          h3('What I use it for'),
          p('Only to reply to your message. I do not sell it, I do not share it with third parties for commercial purposes and I do not send you advertising.'),
          h3('How long I keep it'),
          p('Up to 12 months after you send it, or sooner if you ask me to delete it. To prevent abuse I keep, for 24 hours, a code derived from your IP address; the IP address itself is not stored.'),
          h3('Providers involved'),
          ul([
            'Vercel: hosting of the site.',
            'Neon: database where your message is stored.',
            'Resend: delivery of the internal email notification.',
            'Cloudflare Turnstile: checking that you are not a robot.',
          ]),
          h3('Cookies'),
          p('This site does not use tracking cookies.'),
          h3('Your rights'),
          p('You can request access to, correction of or deletion of your data through the same contact form, choosing the area “Other”.'),
        ),
      } as never,
    })
    cambios.push('Aviso de privacidad (EN): completo')
  }

  // ——— Trayectoria, formación, idiomas: el inglés ya existe desde el seed; solo se publica ———
  if (PUBLICAR_INGLES) {
    for (const col of ['trayectoria', 'formacion', 'idiomas'] as const) {
      const docs = (await payload.find({ collection: col, locale: 'en', fallbackLocale: false, limit: 100, depth: 0 })).docs as unknown as Rec[]
      for (const d of docs) {
        if (d.publicado === true) continue
        try {
          await payload.update({ collection: col, id: d.id as number, locale: 'en', data: { publicado: true } as never })
          cambios.push(`${col} #${d.id} (EN): publicado`)
        } catch (e) {
          cambios.push(`${col} #${d.id} (EN): NO se publicó — ${(e as Error).message.slice(0, 120)}`)
        }
      }
    }
  }

  // ——— Shrimp Intelligence Ecuador ———
  const shrimpEs = (
    await payload.find({ collection: 'proyectos', locale: 'es', where: { slug: { equals: 'shrimp-intelligence-ecuador' } }, limit: 1, depth: 0 })
  ).docs[0] as unknown as Rec | undefined
  if (shrimpEs) {
    const en = await leer('proyectos', shrimpEs.id as number, 'en')
    const d: Rec = {}
    texto(d, en, 'titulo', 'Shrimp Intelligence Ecuador')
    texto(d, en, 'slug', 'shrimp-intelligence-ecuador')
    texto(d, en, 'titular', 'China buys half of Ecuador’s shrimp, and it is the market that pays the least per pound.')
    texto(d, en, 'resumen', 'Pipeline, API and dashboard on Ecuador’s shrimp exports (2018–2026): from public sources that do not match to reconciled figures and a risk simulator.', 'Analysis of Ecuador’s shrimp exports with a layered')
    texto(d, en, 'portadaAlt', 'Power BI dashboard summarizing Ecuador’s shrimp exports: yearly KPIs, monthly value with moving average, destination map and top 10 markets.')
    texto(d, en, 'portadaEtiqueta', 'Power BI · 5 pages')
    texto(d, en, 'preguntaNegocio', 'Who buys Ecuador’s shrimp, at what price, with what risk, and how reliable are the figures for making decisions?', 'How have Ecuador’s shrimp exports evolved')
    texto(d, en, 'problema', doc(
      p('Shrimp is Ecuador’s top non-oil export: USD 8,401 M in 2025, 2.6 times the 2018 value. But its data is scattered and does not match.'),
      ul([
        'The Central Bank of Ecuador (BCE) publishes the official total, but not the breakdown by country.',
        'UN Comtrade has the country detail in two versions: what Ecuador reports (FOB) and what buyers report (mirror, CIF), which differ by up to ±50 % per month.',
        'In 2025 China did not report its imports, and more than half of the value had no identified country.',
      ]),
    ), 'Shrimp is one of Ecuador’s main export products')
    texto(d, en, 'metodo', doc(
      p('I built a 7-stage batch, incremental pipeline in Python that takes raw data to an analysis-ready model in MySQL 8 with a Medallion architecture. Every run is recorded in a log.'),
    ), 'I organized the data in MySQL using a three-layer')
    texto(d, en, 'datosLimpieza', doc(
      p('The monthly total comes from the BCE; the country detail comes from what Ecuador reports, and mirror figures are used only where data is missing. I unified country names with an alias table and measured the differences between sources instead of hiding them.'),
      p('Quality is checked by 141 automated tests: cleaning rules, integrity of the silver and gold layers, the run log and the API. The preferred total matches the BCE in all 104 months, and SQL, API and Power BI return the same figure.'),
    ), 'I gathered data from official sources')
    texto(d, en, 'resultado', doc(
      p('A 5-page Power BI report (Summary, Markets, Simulator, Farm and Reconciliation), a read-only FastAPI service and 12 business SQL queries. The sector grew by volume, not by price: between 2018 and 2020 it sold 39 % more pounds at an 11 % lower price.'),
    ), 'A Power BI dashboard to track')
    texto(d, en, 'aprendizajes', doc(
      p('When sources do not match, the useful thing is to measure the difference and say what each one is good for, not to pick one and hide the other.'),
      p('Next steps: a forecast of monthly exports, a Monte Carlo simulation of concentration risk, data by product type and moving the pipeline to the cloud with scheduled refresh.'),
    ), 'Splitting data into layers makes it easier')
    const fichaEn = (en.ficha ?? {}) as Rec
    if (vacio(fichaEn.tipo) && vacio(fichaEn.periodo) && vacio(fichaEn.fuentesDatos) && vacio(fichaEn.calidad)) {
      d.ficha = {
        tipo: 'Data analysis + engineering',
        periodo: 'January 2018 – August 2026',
        fuentesDatos: 'Central Bank of Ecuador (table 3.1.2) · UN Comtrade',
        calidad: '141 tests · the total matches the BCE in 104 months',
      }
    }
    filas(d, shrimpEs, en, 'destacados', 'texto', {
      'del valor lo compra China': { texto: 'of the value is bought by China' },
      'pruebas automáticas': { texto: 'automated tests' },
      'meses cuadrados con el BCE': { texto: 'months matching the BCE' },
    })
    filas(d, shrimpEs, en, 'hallazgos', 'texto', {
      'USD exportados en 2025, 2,6 veces lo de 2018': { texto: 'USD exported in 2025, 2.6 times the 2018 value' },
      'del valor lo compra China cada año (2019–2024)': { texto: 'of the value is bought by China every year (2019–2024)' },
      'más paga EE. UU. por libra que China (2026, 3 meses con dato)': { texto: 'more per pound paid by the US than by China (2026, 3 months with data)' },
      'USD si China pagara 10 % menos (escenario 2024)': { texto: 'USD if China paid 10 % less (2024 scenario)' },
    })
    filas(d, shrimpEs, en, 'pasos', 'etiqueta', {
      FUENTES: { titulo: 'BCE + UN Comtrade', texto: 'Official total and country detail' },
      BRONZE: { titulo: 'Raw', texto: 'As delivered' },
      SILVER: { titulo: 'Clean and reconciled', texto: '3NF, unified countries' },
      GOLD: { titulo: 'Star schema', texto: '2 facts, 6 dimensions' },
      CONSUMO: { titulo: 'SQL · API · Power BI', texto: 'All three return the same figure' },
    })
    filas(d, shrimpEs, en, 'decisiones', 'titulo', {
      Exportadoras: { titulo: 'Exporters', texto: 'Measure how much their revenue depends on a single market and plan diversification towards those that pay more.' },
      'Gremio y política': { titulo: 'Industry and policy', texto: 'Track the HHI and a stress scenario as sector indicators, not just volume.' },
      Finca: { titulo: 'Farm', texto: 'Harvest at the size that leaves the highest margin (analysis with SIMULATED data from a fictional farm).' },
    })
    filas(d, shrimpEs, en, 'capturas', 'ruta', {
      '/proyectos/shrimp/02_mercados.webp': {
        alt: 'Market analysis: each destination’s share of export value, price per pound for China, the US and Europe, monthly seasonality and destinations table.',
        titulo: 'Markets',
        leyenda: 'China pays less and less per pound: from USD 2.73 (2018) to USD 2.13 (2026), while the US rises to 3.49. May is the strongest month (index 116) and January the weakest (82).',
      },
      '/proyectos/shrimp/05_conciliacion.webp': {
        alt: 'Reconciliation of exports reported by Ecuador against the Central Bank of Ecuador and against what buyer countries record, by year, month and country.',
        titulo: 'Source reconciliation',
        leyenda: 'Each source answers a different question: what Ecuador reports gets close to the BCE over the year (from −7.7 % to −1.1 %), but mirror figures vary by up to ±50 % per month and only 9 of 38 countries match.',
      },
      '/proyectos/shrimp/04_finca.webp': {
        alt: 'Profitability analysis of a shrimp farm with simulated data: margin by selling price, margin by harvest size and pond ranking.',
        titulo: 'Farm (SIMULATED)',
        leyenda: 'SIMULATED DATA from a fictional farm: the method is real, the figures do not describe any company. Harvest size drives the margin: 20/30 leaves 54.6 % versus 27.8 % for 50/60.',
      },
    })
    filas(d, shrimpEs, en, 'enlaces', 'url', {
      'https://github.com/CarlosRomero55/shrimp-intelligence-ecuador/blob/main/docs/powerbi/shrimp_intelligence_dashboard.pdf': { texto: 'Dashboard as PDF' },
    })
    const seoS = (en.seo ?? {}) as Rec
    if (vacio(seoS.titulo) || empiezaCon(seoS.titulo, 'Shrimp Intelligence Ecuador — shrimp exports')) {
      d.seo = {
        titulo: 'Shrimp Intelligence Ecuador — case study',
        descripcion: 'China buys half of Ecuador’s shrimp and pays the least per pound. Pipeline, API and dashboard with a risk simulator.',
      }
    }
    if (PUBLICAR_INGLES && en.publicado !== true) d.publicado = true
    await guardar('proyectos', shrimpEs.id as number, d, 'Shrimp')
  }

  // ——— Sistema escolar ———
  const escEs = (
    await payload.find({ collection: 'proyectos', locale: 'es', where: { slug: { equals: 'sistema-escolar' } }, limit: 1, depth: 0 })
  ).docs[0] as unknown as Rec | undefined
  if (escEs) {
    const en = await leer('proyectos', escEs.id as number, 'en')
    const d: Rec = {}
    texto(d, en, 'titulo', 'School management system')
    texto(d, en, 'slug', 'school-management-system')
    texto(d, en, 'titular', 'Everyone sees only what concerns them: a school system with permissions based on each person’s real relationship to the data.')
    texto(d, en, 'resumen', 'Platform for a primary school with role-based portals, digital authorizations and a gatehouse app that works offline. Fictitious data.')
    texto(d, en, 'portadaAlt', 'A teacher’s portal in the school system: assigned classes, students and submissions to grade. Fictitious data.')
    texto(d, en, 'portadaEtiqueta', 'Live demo')
    texto(d, en, 'preguntaNegocio', 'How can a school manage classes, authorizations and student pick-up without paper, and without anyone seeing data that does not concern them?')
    texto(d, en, 'problema', doc(
      p('In a school, field-trip authorizations, homework and the list of who may pick up each student often live on paper or in scattered messages. They get lost, leave no record and expose minors’ data to people who should not see it.'),
    ))
    texto(d, en, 'metodo', doc(
      p('I designed the system around permissions: each role (administration, coordination, principals, teachers, counseling, audit, gatehouse, guardians and students) sees only the data it has a real relationship with. A guardian sees only their validated children, and a teacher only the students in their classrooms.'),
    ))
    texto(d, en, 'datosLimpieza', doc(
      p('Security by design: passwords hashed with argon2, tokens and codes with HMAC, documents and TOTP secrets encrypted with AES-256-GCM, server-side sessions with a device list and remote sign-out, and an audit log that PostgreSQL does not allow to be modified or deleted.'),
      p('The administrator must give a reason for every look at a student’s data, and that reason is logged. All demo data is fictitious.'),
    ))
    texto(d, en, 'resultado', doc(
      p('A published platform with role-based portals, classes with assignments and grading based on Ecuador’s 2025 evaluation guidelines, digital authorizations tracked by classroom and an installable gatehouse app that keeps working without internet.'),
    ))
    texto(d, en, 'aprendizajes', doc(
      p('Next steps: the school’s public website, the guardian portal, report cards, student wellbeing and assessments, already designed in the project’s architecture.'),
    ))
    const fichaEn = (en.ficha ?? {}) as Rec
    if (vacio(fichaEn.tipo) && vacio(fichaEn.periodo) && vacio(fichaEn.fuentesDatos) && vacio(fichaEn.calidad)) {
      d.ficha = {
        tipo: 'Custom web system',
        periodo: '2026–2027 school year (fictitious data)',
        fuentesDatos: 'Fictitious data: 120 students, 110 families and 8 teachers',
        calidad: '209 tests on SQLite and PostgreSQL · linted with ruff',
      }
    }
    filas(d, escEs, en, 'destacados', 'texto', {
      'segundo factor por rol': { texto: 'second factor per role' },
      'pruebas automáticas': { texto: 'automated tests' },
      'portería sin conexión': { texto: 'offline gatehouse app' },
    })
    filas(d, escEs, en, 'hallazgos', 'cifra', {
      '209': { texto: 'tests on SQLite and PostgreSQL, including cross-role access attempts' },
      '2FA': { texto: 'mandatory second factor per role, with a server-generated QR code' },
      'AES-256': { texto: 'encryption of documents and secrets; passwords with argon2' },
      '12 h': { texto: 'is how long the offline gatehouse roster lasts before it is deleted from the phone' },
    })
    filas(d, escEs, en, 'pasos', 'etiqueta', {
      ROLES: { titulo: 'Relationship-based permissions', texto: 'Each role sees only its own data' },
      ACCESO: { titulo: 'Sessions and 2FA', texto: 'Devices and alerts' },
      CLASES: { titulo: 'Assignments and grades', texto: 'Submissions, rubrics, averages' },
      FAMILIAS: { titulo: 'Authorizations', texto: 'Personal link, no account' },
      'PORTERÍA': { titulo: 'Offline app', texto: 'Installable (PWA)' },
    })
    filas(d, escEs, en, 'capturas', 'ruta', {
      '/proyectos/escuela/autorizaciones.webp': {
        alt: 'Authorization campaign for a field trip: progress percentage, responses by classroom and student list with who signed. Fictitious data.',
        titulo: 'Digital authorizations',
        leyenda: 'Coordination sees in real time how many families authorized a trip, by classroom, who signed and when, and can export the record.',
      },
    })
    filas(d, escEs, en, 'decisiones', 'titulo', {
      'Dirección': { titulo: 'School leadership', texto: 'Know in real time which families authorized an activity and keep an exportable record.' },
      'Portería': { titulo: 'Gatehouse', texto: 'Hand each student only to an authorized person, even without internet.' },
      Familias: { titulo: 'Families', texto: 'Authorize from a personal link, without creating a user or password.' },
    })
    const seoS = (en.seo ?? {}) as Rec
    if (vacio(seoS.titulo)) {
      d.seo = {
        titulo: 'School management system — case study',
        descripcion: 'Web system for a school: role-based portals, digital authorizations and an offline gatehouse app. FastAPI and PostgreSQL.',
      }
    }
    if (PUBLICAR_INGLES && en.publicado !== true) d.publicado = true
    await guardar('proyectos', escEs.id as number, d, 'Sistema escolar')
  }

  // ——— Servicios ———
  const SERV: Record<string, { seedEn?: string; nombre: string; descripcion: string; dolor: string; entregables: Record<string, string> }> = {
    'Dashboards y Business Intelligence': {
      seedEn: 'Data analysis and Business Intelligence',
      nombre: 'Dashboards and Business Intelligence',
      descripcion: 'Your data lives in Excel or in your system, but nobody sees it together.',
      dolor: 'I only find out how the business is doing at the end of the month.',
      entregables: {
        'Dashboard en Power BI con los indicadores que definimos juntos': 'Power BI dashboard with the KPIs we define together',
        'Títulos que dicen la conclusión, no solo el gráfico': 'Titles that state the conclusion, not just the chart',
        'Guía de uso y actualización': 'User and refresh guide',
      },
    },
    'Ingeniería de datos y ETL': {
      seedEn: 'Data engineering',
      nombre: 'Data engineering and ETL',
      descripcion: 'Information is spread across files and systems that do not match.',
      dolor: 'Every report gives a different number.',
      entregables: {
        'Base de datos ordenada por capas (bronze, silver, gold)': 'Database organized in layers (bronze, silver, gold)',
        'Procesos de carga automáticos y con pruebas de calidad': 'Automated loading processes with quality tests',
        'Documentación de cada decisión': 'Documentation of every decision',
      },
    },
    'Automatización de procesos': {
      seedEn: 'Process automation',
      nombre: 'Process automation',
      descripcion: 'The same report is built by hand every week.',
      dolor: 'We spend hours copying and pasting.',
      entregables: {
        'Un proceso que junta y limpia los archivos solo': 'A process that gathers and cleans the files on its own',
        'El reporte listo en un clic': 'The report ready in one click',
        'Manual corto para tu equipo': 'A short manual for your team',
      },
    },
    'Sistemas web a medida': {
      nombre: 'Custom web systems',
      descripcion: 'You need each person to see only what is theirs.',
      dolor: 'Everything goes through paper and WhatsApp, and gets lost.',
      entregables: {
        'Sistema web con usuarios y permisos por rol': 'Web system with users and role-based permissions',
        'Seguridad: segundo factor, datos cifrados y bitácora': 'Security: second factor, encrypted data and audit log',
        'Publicado en internet y con pruebas automáticas': 'Published online, with automated tests',
      },
    },
    'Inventario y punto de venta': {
      nombre: 'Inventory and point of sale',
      descripcion: 'Purchases, sales and stock in one place.',
      dolor: 'I don’t know how much stock I have or how much I sold today.',
      entregables: {
        'Inventario, compras y ventas en un solo lugar': 'Inventory, purchases and sales in one place',
        'Caja diaria y reportes': 'Daily cash register and reports',
      },
    },
  }
  const serviciosEs = (await payload.find({ collection: 'servicios', locale: 'es', limit: 100, depth: 0 })).docs as unknown as Rec[]
  for (const s of serviciosEs) {
    const t = SERV[String(s.nombre)]
    if (!t) continue
    const en = await leer('servicios', s.id as number, 'en')
    const d: Rec = {}
    texto(d, en, 'nombre', t.nombre, t.seedEn)
    texto(d, en, 'descripcion', t.descripcion)
    // La descripción vieja del seed en inglés se reemplaza (empezaba distinto en cada servicio).
    if (!d.descripcion && typeof en.descripcion === 'string' && /^(Power BI dashboards|Layered data models|Automation of reports)/.test(en.descripcion)) {
      d.descripcion = t.descripcion
    }
    texto(d, en, 'dolor', t.dolor)
    filas(d, s, en, 'entregables', 'texto', Object.fromEntries(Object.entries(t.entregables).map(([k, v]) => [k, { texto: v }])))
    if (PUBLICAR_INGLES && en.publicado !== true) d.publicado = true
    await guardar('servicios', s.id as number, d, `Servicio "${s.nombre}"`)
  }

  // ——— Fase 6: primer artículo (borrador) ———
  const existe = await payload.count({ collection: 'articulos', where: { slug: { equals: 'cuando-las-fuentes-no-coinciden' } }, locale: 'es' })
  if (existe.totalDocs === 0) {
    const proyecto = shrimpEs?.id ?? null
    const a = await payload.create({
      collection: 'articulos',
      locale: 'es',
      data: {
        publicado: PUBLICAR_ARTICULO,
        titulo: 'Cuando tres fuentes oficiales no coinciden: lo que aprendí con las exportaciones de camarón',
        slug: 'cuando-las-fuentes-no-coinciden',
        fecha: '2026-11-13',
        resumen: 'El BCE, lo que declara Ecuador y lo que declaran los compradores dan cifras distintas. En lugar de elegir una, medí la diferencia. Esto es lo que encontré.',
        portadaRuta: '/proyectos/shrimp/05_conciliacion.webp',
        portadaAlt: 'Página de conciliación de fuentes del dashboard de Shrimp Intelligence Ecuador.',
        etiquetas: ['Ingeniería de datos', 'Calidad de datos', 'Power BI'],
        proyecto,
        contenido: doc(
          p('El camarón es la primera exportación no petrolera del Ecuador: 8.401 millones de dólares en 2025. Cuando empecé Shrimp Intelligence Ecuador pensé que el reto sería el análisis. El reto real fue otro: las cifras oficiales no coinciden entre sí.'),
          h3('Tres fuentes, tres números'),
          ul([
            'El Banco Central del Ecuador publica el total oficial, pero no dice a qué país se vendió.',
            'UN Comtrade tiene el detalle por país según lo que declara Ecuador (FOB).',
            'UN Comtrade también tiene lo que declaran los países compradores (cifras espejo, CIF). Mes a mes, pueden diferir hasta ±50 %.',
          ]),
          p('Y en 2025 China no reportó sus importaciones, así que más de la mitad del valor quedó sin país identificado.'),
          h3('No elegir una fuente: medir la diferencia'),
          p('La tentación era quedarme con la fuente que “se viera mejor”. En cambio, definí una regla y la documenté: el total de cada mes es el del BCE; el detalle por país viene de lo que declara Ecuador, y las cifras espejo se usan solo donde falta información. Las diferencias entre fuentes se calculan y se muestran en una página propia del dashboard.'),
          p('Para que la regla se cumpla siempre, el pipeline tiene 141 pruebas automáticas. Una de ellas comprueba que el total cuadre con el BCE en los 104 meses analizados.'),
          h3('Lo que encontré'),
          ul([
            'Lo que declara Ecuador se acerca al BCE en el año: la brecha pasó de −7,7 % a −1,1 %.',
            'Mes a mes, en cambio, las cifras espejo se alejan hasta 50 %: el barco sale de Ecuador un mes y llega al comprador en otro.',
            'Solo 9 de 38 países coinciden con lo que declara Ecuador.',
          ]),
          p('La conclusión práctica: cada fuente sirve para una pregunta distinta. El BCE para el total, lo declarado por Ecuador para el detalle por país en el año, y las cifras espejo solo para llenar huecos, nunca para comparar meses.'),
          h3('Por qué importa'),
          p('Un dashboard bonito con cifras que no cuadran le quita confianza a todo lo demás. Medir y mostrar la diferencia entre fuentes no es un detalle técnico: es lo que permite que alguien tome una decisión con esos números.'),
        ),
        seo: {
          titulo: 'Cuando tres fuentes oficiales no coinciden — Carlos Romero',
          descripcion: 'Cómo concilié las cifras del BCE y UN Comtrade sobre las exportaciones de camarón, y por qué cada fuente sirve para una pregunta distinta.',
        },
      } as never,
    })
    await payload.update({
      collection: 'articulos',
      id: a.id,
      locale: 'en',
      data: {
        publicado: PUBLICAR_ARTICULO,
        titulo: 'When three official sources don’t match: what I learned from Ecuador’s shrimp exports',
        slug: 'when-sources-dont-match',
        resumen: 'The Central Bank, what Ecuador reports and what buyers report give different figures. Instead of picking one, I measured the gap. This is what I found.',
        portadaAlt: 'Source reconciliation page of the Shrimp Intelligence Ecuador dashboard.',
        contenido: doc(
          p('Shrimp is Ecuador’s top non-oil export: USD 8,401 million in 2025. When I started Shrimp Intelligence Ecuador I thought the challenge would be the analysis. The real challenge was something else: the official figures do not match each other.'),
          h3('Three sources, three numbers'),
          ul([
            'The Central Bank of Ecuador publishes the official total, but not which country the shrimp was sold to.',
            'UN Comtrade has the country detail as reported by Ecuador (FOB).',
            'UN Comtrade also has what buyer countries report (mirror figures, CIF). Month by month, they can differ by up to ±50 %.',
          ]),
          p('And in 2025 China did not report its imports, so more than half of the value had no identified country.'),
          h3('Don’t pick a source: measure the gap'),
          p('The temptation was to keep the source that “looked best”. Instead, I defined a rule and documented it: each month’s total comes from the Central Bank; the country detail comes from what Ecuador reports, and mirror figures are used only where data is missing. The differences between sources are calculated and shown on their own dashboard page.'),
          p('To make sure the rule always holds, the pipeline has 141 automated tests. One of them checks that the total matches the Central Bank in all 104 months analyzed.'),
          h3('What I found'),
          ul([
            'What Ecuador reports gets close to the Central Bank over the year: the gap went from −7.7 % to −1.1 %.',
            'Month by month, however, mirror figures drift by up to 50 %: a ship leaves Ecuador in one month and reaches the buyer in another.',
            'Only 9 of 38 countries match what Ecuador reports.',
          ]),
          p('The practical conclusion: each source answers a different question. The Central Bank for the total, Ecuador’s reports for the yearly country detail, and mirror figures only to fill gaps, never to compare months.'),
          h3('Why it matters'),
          p('A beautiful dashboard with figures that don’t add up undermines everything else. Measuring and showing the gap between sources is not a technical detail: it is what lets someone make a decision with those numbers.'),
        ),
        seo: {
          titulo: 'When three official sources don’t match — Carlos Romero',
          descripcion: 'How I reconciled Central Bank and UN Comtrade figures on Ecuador’s shrimp exports, and why each source answers a different question.',
        },
      } as never,
    })
    cambios.push(`Artículo creado (ES + EN) ${PUBLICAR_ARTICULO ? 'y publicado' : 'como BORRADOR sin publicar'}`)
  } else if (PUBLICAR_ARTICULO) {
    const a = (await payload.find({ collection: 'articulos', where: { slug: { equals: 'cuando-las-fuentes-no-coinciden' } }, locale: 'es', limit: 1 })).docs[0]
    for (const locale of ['es', 'en'] as const) {
      const actual = (await payload.findByID({ collection: 'articulos', id: a.id, locale, fallbackLocale: false })) as unknown as Rec
      if (actual.publicado !== true) {
        await payload.update({ collection: 'articulos', id: a.id, locale, data: { publicado: true } as never })
        cambios.push(`Artículo (${locale.toUpperCase()}): publicado`)
      }
    }
  }

  console.log(cambios.length ? `Cambios:\n- ${cambios.join('\n- ')}` : 'Sin cambios: todo estaba al día.')
  process.exit(0)
}

main().catch((e) => {
  console.error('Contenido v3 falló:', e instanceof Error ? e.message : e)
  process.exit(1)
})
