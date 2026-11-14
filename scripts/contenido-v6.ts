/**
 * Contenido v6 (13 nov 2026): proyecto "Citas, facturación y caja" (demo-citas-facturacion, GitHub Pages).
 *
 * Fuente: ficha-citas-facturacion.json y README del repositorio CarlosRomero55/demo-citas-facturacion.
 * Mismas reglas que v4: crea en español (publicado) solo si no existe, nunca pisa lo editado en el panel,
 * el inglés queda sin publicar salvo PUBLICAR_INGLES=true. Datos ficticios (Clínica Veterinaria Patitas).
 * Uso: pnpm contenido:v6
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { doc, p, ul } from './lexical'

type Rec = Record<string, unknown>

const PUBLICAR_INGLES = process.env.PUBLICAR_INGLES === 'true'
const SLUG = 'citas-facturacion-caja'
const DEMO = 'https://carlosromero55.github.io/demo-citas-facturacion/'
const REPO = 'https://github.com/CarlosRomero55/demo-citas-facturacion'

const vacio = (v: unknown) =>
  v === null || v === undefined || v === '' || (Array.isArray(v) && v.length === 0) ||
  (typeof v === 'object' && v !== null && 'root' in v && !/"text":"[^"]*\S/.test(JSON.stringify(v)))

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
        orden: 4,
        destacado: false,
        titulo: 'Citas, facturación y caja para negocios de servicios',
        slug: SLUG,
        area: 'web',
        titular: 'De la cita a la factura y al cierre de caja: sin cruces de horario, sin facturar dos veces y con el faltante a la vista.',
        resumen: 'Sistema web de agenda, facturación simulada tipo SRI y control de caja para veterinarias, consultorios odontológicos y peluquerías en Ecuador. Datos ficticios.',
        tecnologias: ['HTML', 'CSS', 'JavaScript', 'Chart.js'],
        portadaRuta: '/proyectos/citas/agenda.webp',
        portadaAlt: 'Agenda semanal de la Clínica Veterinaria Patitas con las citas de cada día por profesional y sus estados. Datos ficticios.',
        portadaEtiqueta: 'Demo en línea',
        destacados: [
          { cifra: '3', texto: 'giros: veterinaria, odontología y peluquería' },
          { cifra: '3', texto: 'roles: administración, recepción y profesional' },
          { cifra: '49', texto: 'dígitos en la clave de acceso, con módulo 11' },
        ],
        hallazgos: [
          { cifra: '0', texto: 'cruces de horario: la agenda los bloquea, también al arrastrar una cita', tono: 'destacado' },
          { cifra: '1', texto: 'factura por cita atendida: no se puede facturar dos veces', tono: 'normal' },
          { cifra: 'NC', texto: 'las facturas no se borran: se anulan con nota de crédito', tono: 'normal' },
          { cifra: 'CSV', texto: 'reportes exportables, protegidos contra inyección de fórmulas', tono: 'normal' },
        ],
        ficha: {
          tipo: 'Sistema web a medida (demo)',
          periodo: 'Negocio ficticio: Clínica Veterinaria Patitas',
          fuentesDatos: 'Datos ficticios, guardados solo en el navegador',
          calidad: 'Validación de cédula y RUC · facturas simuladas sin validez ante el SRI',
        },
        preguntaNegocio: '¿Cómo puede un negocio de servicios dejar de perder dinero por inasistencias, cruces de horario y cobros sin control, y saber qué servicio y qué profesional generan más ingresos?',
        problema: doc(
          p('Muchos negocios pequeños llevan la agenda en cuaderno o WhatsApp, cobran sin control de caja y no saben cuánto les deben ni qué profesional o servicio genera más ingresos. Las inasistencias y los cruces de horario les cuestan dinero cada semana.'),
        ),
        metodo: doc(
          p('Una aplicación única con selector de giro que centraliza citas, clientes, facturación y caja: bloquea cruces de horario, envía recordatorios por WhatsApp, factura desde la cita atendida, cuadra la caja con arqueo y muestra indicadores de ingresos e inasistencia.'),
          ul([
            'Agenda por día y semana por profesional, con bloqueo de cruces de horario y arrastrar para mover.',
            'Estados de cita: agendada, confirmada, atendida, no asistió y cancelada; recordatorio por WhatsApp con mensaje prellenado.',
            'Clientes y pacientes con validación de cédula y RUC; mascotas y vacunas, tratamientos por pieza dental o preferencias según el giro.',
            'Facturación simulada con numeración 001-001-000000123, clave de acceso de 49 dígitos y RIDE imprimible en A4 con marca de agua.',
            'Caja con apertura, egresos y cierre con arqueo por denominación; cuentas por cobrar con abonos y antigüedad de saldos.',
            'Reportes por servicio, profesional y forma de pago, con exportación CSV.',
          ]),
        ),
        datosLimpieza: doc(
          p('Seguridad en la demo: ningún dato del usuario se inserta como HTML, la Content Security Policy es restrictiva, Chart.js se carga con versión fija e integridad SRI y se validan cédula, RUC, montos, fechas, horarios y operaciones duplicadas. No usa APIs externas ni claves: los datos no salen del navegador.'),
          p('En una versión para un cliente, los datos de salud se tratan como sensibles según la LOPDP de Ecuador (consentimiento, cifrado y registro de accesos), los roles se validan en el servidor y la facturación electrónica real usa la firma electrónica guardada como secreto en el servidor.'),
        ),
        pasos: [
          { etiqueta: '01', titulo: 'Agendar', texto: 'Sin cruces de horario', color: 'ninguno' },
          { etiqueta: '02', titulo: 'Recordar', texto: 'Mensaje por WhatsApp', color: 'ninguno' },
          { etiqueta: '03', titulo: 'Atender', texto: 'Notas e historial', color: 'ninguno' },
          { etiqueta: '04', titulo: 'Facturar', texto: 'RIDE con clave de acceso', color: 'ninguno' },
          { etiqueta: '05', titulo: 'Cerrar caja', texto: 'Arqueo y faltantes', color: 'ninguno' },
        ],
        resultado: doc(
          p('Una demo publicada que se usa de punta a punta: agendar, confirmar, atender, facturar, cobrar a crédito, abonar, anular con nota de crédito y cerrar la caja. El giro se cambia desde la barra superior.'),
          p('Para probarla: admin / admin123 (todo), recepcion / recep123 o pro1 / pro123 (agenda propia). Todo se guarda solo en tu navegador y se puede restablecer desde Configuración. Las facturas son simuladas y no tienen validez ante el SRI.'),
        ),
        capturas: [
          {
            ruta: '/proyectos/citas/ride.webp',
            alt: 'RIDE de una factura simulada de la Clínica Veterinaria Patitas con número 001-001, clave de acceso, código de barras, subtotales con IVA y marca de agua de simulación. Datos ficticios.',
            titulo: 'RIDE de la factura',
            leyenda: 'Factura simulada con numeración del SRI, clave de acceso de 49 dígitos y código de barras; la marca de agua indica que no tiene validez tributaria.',
          },
          {
            ruta: '/proyectos/citas/arqueo.webp',
            alt: 'Cierre de caja con arqueo por billetes y monedas: total contado, faltante de $1,24 y observación obligatoria. Datos ficticios.',
            titulo: 'Cierre de caja con arqueo',
            leyenda: 'Se cuentan billetes y monedas; si el total no cuadra con el efectivo esperado, el sistema muestra el faltante y exige una observación.',
          },
          {
            ruta: '/proyectos/citas/dashboard.webp',
            alt: 'Panel de inicio con citas de hoy por estado, ingresos del día y del mes, tasa de inasistencia y servicios más vendidos. Datos ficticios.',
            titulo: 'Inicio',
            leyenda: 'Citas del día, ingresos, inasistencia, efectivo en caja y saldo por cobrar en una sola vista.',
          },
        ],
        decisiones: [
          { titulo: 'Dueño', texto: 'Ver qué servicio y qué profesional generan más ingresos y cuánto le deben.' },
          { titulo: 'Recepción', texto: 'Agendar sin cruces, recordar por WhatsApp y cobrar desde la misma cita.' },
          { titulo: 'Caja', texto: 'Cerrar el turno sabiendo si falta o sobra efectivo, con la observación registrada.' },
        ],
        aprendizajes: doc(
          p('La versión para un cliente usaría el mismo stack de este portafolio: Next.js, PostgreSQL (Neon) y Payload CMS en Vercel, con autenticación real, roles validados en el servidor y facturación electrónica mediante un proveedor autorizado.'),
        ),
        demo: DEMO,
        repositorio: REPO,
        contieneDatosSimulados: true,
        seo: {
          titulo: 'Citas, facturación y caja — caso de estudio',
          descripcion: 'Demo de agenda, facturación simulada tipo SRI y control de caja para veterinarias, odontologías y peluquerías. Datos ficticios.',
        },
      } as never,
    })) as unknown as Rec
    cambios.push('Citas, facturación y caja: creado y publicado en español')
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

  texto('titulo', 'Appointments, invoicing and cash register for service businesses')
  texto('slug', 'appointments-invoicing-cash-register')
  texto('titular', 'From appointment to invoice to cash close: no double bookings, no invoicing twice, and any shortage in plain sight.')
  texto('resumen', 'Web system for scheduling, simulated SRI-style invoicing and cash control for veterinary clinics, dental offices and hair salons in Ecuador. Fictitious data.')
  texto('portadaAlt', 'Weekly schedule of Clínica Veterinaria Patitas with each day’s appointments per professional and their statuses. Fictitious data.')
  texto('portadaEtiqueta', 'Live demo')
  texto('preguntaNegocio', 'How can a service business stop losing money to no-shows, double bookings and uncontrolled payments, and know which service and which professional bring in the most revenue?')
  texto('problema', doc(
    p('Many small businesses keep their schedule in a notebook or on WhatsApp, collect payments without cash control and don’t know who owes them money or which professional or service brings in the most revenue. No-shows and double bookings cost them money every week.'),
  ))
  texto('metodo', doc(
    p('A single app with a business-type selector that brings together appointments, clients, invoicing and the cash register: it blocks overlapping bookings, sends WhatsApp reminders, invoices straight from the completed appointment, reconciles the cash drawer with a denomination count and shows revenue and no-show metrics.'),
    ul([
      'Daily and weekly schedule per professional, with overlap blocking and drag-to-move.',
      'Appointment statuses: scheduled, confirmed, completed, no-show and cancelled; WhatsApp reminder with a pre-filled message.',
      'Clients and patients with Ecuadorian ID (cédula) and tax ID (RUC) validation; pets and vaccines, treatments per tooth or preferences depending on the business type.',
      'Simulated invoicing with 001-001-000000123 numbering, a 49-digit access key and a printable A4 invoice (RIDE) with a watermark.',
      'Cash register with opening float, expenses and closing with a denomination count; accounts receivable with partial payments and aging.',
      'Reports by service, professional and payment method, with CSV export.',
    ]),
  ))
  texto('datosLimpieza', doc(
    p('Security in the demo: user data is never inserted as HTML, the Content Security Policy is strict, Chart.js is loaded with a pinned version and SRI integrity, and ID and tax numbers, amounts, dates, schedules and duplicate operations are validated. No external APIs or keys: data never leaves the browser.'),
    p('In a client version, health data is treated as sensitive under Ecuador’s data protection law (consent, encryption and access logs), roles are enforced on the server and real e-invoicing uses the electronic signature stored as a server-side secret.'),
  ))
  texto('resultado', doc(
    p('A published demo you can use end to end: schedule, confirm, attend, invoice, sell on credit, record partial payments, void with a credit note and close the cash register. The business type is switched from the top bar.'),
    p('To try it: admin / admin123 (full access), recepcion / recep123 or pro1 / pro123 (own schedule). Everything is stored only in your browser and can be reset from Settings. Invoices are simulated and have no validity with the SRI.'),
  ))
  texto('aprendizajes', doc(
    p('The client version would use the same stack as this portfolio: Next.js, PostgreSQL (Neon) and Payload CMS on Vercel, with real authentication, server-side roles and e-invoicing through an authorized provider.'),
  ))
  const fichaEn = (en.ficha ?? {}) as Rec
  if (vacio(fichaEn.tipo) && vacio(fichaEn.periodo) && vacio(fichaEn.fuentesDatos) && vacio(fichaEn.calidad)) {
    d.ficha = {
      tipo: 'Custom web system (demo)',
      periodo: 'Fictitious business: Clínica Veterinaria Patitas',
      fuentesDatos: 'Fictitious data, stored only in the browser',
      calidad: 'ID and tax number validation · simulated invoices with no SRI validity',
    }
  }
  filas('destacados', 'texto', {
    'giros: veterinaria, odontología y peluquería': { texto: 'business types: veterinary, dental and salon' },
    'roles: administración, recepción y profesional': { texto: 'roles: admin, front desk and professional' },
    'dígitos en la clave de acceso, con módulo 11': { texto: 'digits in the access key, with modulo 11 check' },
  })
  filas('hallazgos', 'cifra', {
    '0': { texto: 'double bookings: the schedule blocks them, even when dragging an appointment' },
    '1': { texto: 'invoice per completed appointment: it can’t be invoiced twice' },
    NC: { texto: 'invoices are never deleted: they are voided with a credit note' },
    CSV: { texto: 'exportable reports, protected against formula injection' },
  })
  filas('pasos', 'etiqueta', {
    '01': { titulo: 'Schedule', texto: 'No double bookings' },
    '02': { titulo: 'Remind', texto: 'WhatsApp message' },
    '03': { titulo: 'Attend', texto: 'Notes and history' },
    '04': { titulo: 'Invoice', texto: 'RIDE with access key' },
    '05': { titulo: 'Close cash', texto: 'Count and shortages' },
  })
  filas('capturas', 'ruta', {
    '/proyectos/citas/ride.webp': {
      alt: 'Printable invoice (RIDE) from a simulated invoice of Clínica Veterinaria Patitas with 001-001 number, access key, barcode, VAT subtotals and a simulation watermark. Fictitious data.',
      titulo: 'Invoice (RIDE)',
      leyenda: 'Simulated invoice with SRI numbering, a 49-digit access key and a barcode; the watermark shows it has no tax validity.',
    },
    '/proyectos/citas/arqueo.webp': {
      alt: 'Cash close with a count of bills and coins: total counted, a $1.24 shortage and a required note. Fictitious data.',
      titulo: 'Cash close with count',
      leyenda: 'Bills and coins are counted; if the total doesn’t match the expected cash, the system shows the shortage and requires a note.',
    },
    '/proyectos/citas/dashboard.webp': {
      alt: 'Home dashboard with today’s appointments by status, daily and monthly revenue, no-show rate and top services. Fictitious data.',
      titulo: 'Home',
      leyenda: 'Today’s appointments, revenue, no-shows, cash on hand and receivables in a single view.',
    },
  })
  filas('decisiones', 'titulo', {
    'Dueño': { titulo: 'Owner', texto: 'See which service and which professional bring in the most revenue and how much is owed.' },
    'Recepción': { titulo: 'Front desk', texto: 'Book without overlaps, remind via WhatsApp and charge from the same appointment.' },
    Caja: { titulo: 'Cash register', texto: 'Close the shift knowing whether cash is short or over, with the note on record.' },
  })
  const seoEn = (en.seo ?? {}) as Rec
  if (vacio(seoEn.titulo)) {
    d.seo = {
      titulo: 'Appointments, invoicing and cash register — case study',
      descripcion: 'Scheduling, simulated SRI-style invoicing and cash control demo for veterinary, dental and salon businesses. Fictitious data.',
    }
  }
  if (PUBLICAR_INGLES && en.publicado !== true) d.publicado = true
  if (Object.keys(d).length > 0) {
    await payload.update({ collection: 'proyectos', id, locale: 'en', data: d as never })
    cambios.push(`Citas (EN): ${Object.keys(d).join(', ')}`)
  }

  console.log(cambios.length ? `Cambios:\n- ${cambios.join('\n- ')}` : 'Sin cambios: todo estaba al día.')
  process.exit(0)
}

main().catch((e) => {
  console.error('Contenido v6 falló:', e instanceof Error ? e.message : e)
  process.exit(1)
})
