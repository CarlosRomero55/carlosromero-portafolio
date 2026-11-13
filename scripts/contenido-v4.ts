/**
 * Contenido v4 (13 nov 2026): proyecto "Inventario + punto de venta" (demo-inventario-pos).
 *
 * Fuente: ficha/inventario-pos.json del repositorio CarlosRomero55/demo-inventario-pos.
 * Reglas (iguales a v2 y v3):
 *  - Crea el proyecto en español (publicado) solo si no existe. Nunca borra ni pisa lo editado en el panel.
 *  - El inglés se llena si está vacío y queda SIN PUBLICAR, salvo PUBLICAR_INGLES=true.
 *  - El servicio "Inventario y punto de venta" pasa a "disponible" con la demo, solo si sigue en "próximamente".
 *  - Todos los datos del proyecto son ficticios (Ferretería El Tornillo) y así se indica.
 * Uso: pnpm contenido:v4
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { doc, p, ul } from './lexical'

type Rec = Record<string, unknown>

const PUBLICAR_INGLES = process.env.PUBLICAR_INGLES === 'true'
const SLUG = 'inventario-punto-de-venta'
const DEMO = 'https://demo-inventario-pos.vercel.app'
const REPO = 'https://github.com/CarlosRomero55/demo-inventario-pos'

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
        orden: 3,
        destacado: true,
        titulo: 'Inventario + punto de venta para pymes',
        slug: SLUG,
        area: 'web',
        titular: 'Ventas, compras y stock conectados: cada movimiento queda en el kardex y la caja se cuadra sola al cerrar el turno.',
        resumen: 'Demo funcional de inventario y caja para ferreterías, papelerías y minimarkets: vende, controla stock, registra compras y cuadra la caja desde el navegador. Datos ficticios.',
        tecnologias: ['HTML', 'CSS', 'JavaScript', 'Chart.js'],
        portadaRuta: '/proyectos/inventario/dashboard.webp',
        portadaAlt: 'Dashboard de la Ferretería El Tornillo: ventas de hoy, de la semana y del mes, ticket promedio, margen bruto, ventas por día y alertas de stock bajo. Datos ficticios.',
        portadaEtiqueta: 'Demo en línea',
        destacados: [
          { cifra: '2', texto: 'roles: administrador y cajero' },
          { cifra: '80 mm', texto: 'ticket con IVA 0 % y 15 %' },
          { cifra: 'CSV', texto: 'reportes exportables' },
        ],
        hallazgos: [
          { cifra: 'POS', texto: 'no deja vender un producto sin existencias, y cada compra recalcula el costo promedio', tono: 'destacado' },
          { cifra: '0', texto: 'cookies, claves o APIs externas: los datos no salen del navegador', tono: 'normal' },
          { cifra: 'CSP', texto: 'restrictiva, y los datos ingresados nunca se insertan como HTML', tono: 'normal' },
          { cifra: 'CSV', texto: 'exportado protegido contra inyección de fórmulas', tono: 'normal' },
        ],
        ficha: {
          tipo: 'Sistema web a medida (demo)',
          periodo: 'Negocio ficticio: Ferretería El Tornillo',
          fuentesDatos: 'Datos ficticios, guardados solo en el navegador',
          calidad: 'Validación de todas las entradas · CSV protegido contra fórmulas',
        },
        preguntaNegocio: '¿Cómo puede una pyme saber qué se está por agotar, cuánto gana de verdad y cuánto efectivo debería haber en caja, sin cuadernos ni Excel sueltos?',
        problema: doc(
          p('Muchas pymes controlan su inventario en cuadernos o en hojas de Excel sueltas. No saben qué producto está por agotarse, el costo real de lo que venden ni cuánto efectivo debería haber al cerrar la caja, y cada descuadre se descubre tarde.'),
        ),
        metodo: doc(
          p('Un sistema que conecta ventas, compras e inventario: cada movimiento queda en el kardex con fecha, usuario y saldo, el costo se recalcula con promedio ponderado en cada compra, el POS no deja vender sin stock y el cierre de turno compara el efectivo esperado con el contado.'),
          ul([
            'Login con roles: administrador (todo) y cajero (POS, cierre de turno y consulta de stock).',
            'Dashboard con ventas de hoy, semana y mes, ticket promedio, margen bruto, top 5 productos y alertas de stock bajo.',
            'Compras a proveedores con varias líneas, kardex por producto y ajustes con motivo obligatorio.',
            'Punto de venta con búsqueda por nombre, SKU o código, descuentos con límite para cajero, subtotales 0 % y 15 %, pago mixto, vuelto y ticket de 80 mm.',
            'Anulación de ventas solo por administrador y con motivo; el stock se devuelve solo.',
            'Reportes por día, producto, categoría y cajero con exportación a CSV.',
          ]),
        ),
        datosLimpieza: doc(
          p('Seguridad en la demo: los datos ingresados se muestran con textContent y nunca como HTML, la Content Security Policy solo permite scripts propios y Chart.js con integridad SRI, todas las entradas se validan y el CSV exportado está protegido contra inyección de fórmulas. No usa APIs externas, claves ni cookies: los datos no salen del navegador.'),
          p('En la demo los roles son solo de interfaz. En una versión para un cliente se validan en el servidor, con contraseñas cifradas con argon2, sesiones httpOnly y bitácora de auditoría.'),
        ),
        pasos: [
          { etiqueta: '01', titulo: 'Entra mercadería', texto: 'Sube stock y recalcula costo', color: 'ninguno' },
          { etiqueta: '02', titulo: 'Cada movimiento', texto: 'Fecha, usuario y saldo', color: 'ninguno' },
          { etiqueta: '03', titulo: 'Punto de venta', texto: 'Sin stock no se vende', color: 'ninguno' },
          { etiqueta: '04', titulo: 'Cierre de turno', texto: 'Esperado vs. contado', color: 'ninguno' },
          { etiqueta: '05', titulo: 'Qué se vende', texto: 'Por día, producto y cajero', color: 'ninguno' },
        ],
        resultado: doc(
          p('Una demo publicada que se puede usar de punta a punta: entrar como administrador o cajero, vender, registrar compras, revisar el kardex, cerrar el turno y exportar reportes.'),
          p('Para probarla: usuario admin / demo123 o cajero / demo123. Todo se guarda solo en tu navegador y hay un botón para restablecer la demo. El ticket no tiene validez tributaria.'),
        ),
        capturas: [
          {
            ruta: '/proyectos/inventario/pos.webp',
            alt: 'Punto de venta con la venta en curso: productos, descuentos, subtotales con IVA 0 % y 15 % y total a cobrar. Datos ficticios.',
            titulo: 'Punto de venta',
            leyenda: 'El cajero busca por nombre, SKU o código, aplica descuentos dentro de su límite y el ticket separa los subtotales con IVA 0 % y 15 %.',
          },
        ],
        decisiones: [
          { titulo: 'Dueño', texto: 'Saber cada día cuánto vendió, con qué margen y qué productos debe reponer.' },
          { titulo: 'Caja', texto: 'Cerrar el turno sabiendo si falta o sobra efectivo y en qué método de pago.' },
          { titulo: 'Bodega', texto: 'Ver el saldo real de cada producto y quién hizo cada movimiento.' },
        ],
        aprendizajes: doc(
          p('La versión para un cliente usaría el mismo stack de este portafolio: Next.js, PostgreSQL (Neon) y Payload CMS en Vercel, con los roles validados en el servidor.'),
        ),
        demo: DEMO,
        repositorio: REPO,
        contieneDatosSimulados: true,
        seo: {
          titulo: 'Inventario + punto de venta — caso de estudio',
          descripcion: 'Demo de inventario y caja para pymes: punto de venta, kardex, compras, cierre de turno y reportes. Datos ficticios.',
        },
      } as never,
    })) as unknown as Rec
    cambios.push('Inventario + punto de venta: creado y publicado en español')
  }

  // ——— Proyecto en inglés ———
  const id = proyecto.id as number
  const es = (await payload.findByID({ collection: 'proyectos', id, locale: 'es', fallbackLocale: false, depth: 0 })) as unknown as Rec
  const en = (await payload.findByID({ collection: 'proyectos', id, locale: 'en', fallbackLocale: false, depth: 0 })) as unknown as Rec
  const d: Rec = {}
  const texto = (campo: string, valor: unknown) => {
    if (vacio(en[campo])) d[campo] = valor
  }
  /** Filas con subcampos localizados: mismo id que la fila en español, traducida por su texto. */
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

  texto('titulo', 'Inventory + point of sale for small businesses')
  texto('slug', 'inventory-point-of-sale')
  texto('titular', 'Sales, purchases and stock connected: every movement goes into the stock ledger and the cash drawer balances itself at shift close.')
  texto('resumen', 'Working demo of inventory and checkout for hardware stores, stationery shops and mini-markets: sell, track stock, record purchases and balance the cash drawer from the browser. Fictitious data.')
  texto('portadaAlt', 'Dashboard of Ferretería El Tornillo: today’s, weekly and monthly sales, average ticket, gross margin, daily sales and low-stock alerts. Fictitious data.')
  texto('portadaEtiqueta', 'Live demo')
  texto('preguntaNegocio', 'How can a small business know what is about to run out, what it really earns and how much cash should be in the drawer, without notebooks or scattered Excel sheets?')
  texto('problema', doc(
    p('Many small businesses track inventory in notebooks or scattered Excel sheets. They don’t know which product is about to run out, the real cost of what they sell, or how much cash should be in the drawer at closing, so every shortage is discovered too late.'),
  ))
  texto('metodo', doc(
    p('A system that connects sales, purchases and inventory: every movement is logged in the stock ledger with date, user and balance, cost is recalculated with weighted average on each purchase, the POS blocks sales without stock, and the shift close compares expected versus counted cash.'),
    ul([
      'Role-based login: administrator (full access) and cashier (POS, shift close and stock lookup).',
      'Dashboard with today’s, weekly and monthly sales, average ticket, gross margin, top 5 products and low-stock alerts.',
      'Multi-line supplier purchases, per-product stock ledger and adjustments with a mandatory reason.',
      'Point of sale with search by name, SKU or barcode, discounts capped for cashiers, 0% and 15% VAT subtotals, split payment, change and 80 mm receipt.',
      'Sale voiding restricted to administrators with a reason; stock is returned automatically.',
      'Reports by day, product, category and cashier with CSV export.',
    ]),
  ))
  texto('datosLimpieza', doc(
    p('Security in the demo: user input is rendered with textContent and never as HTML, the Content Security Policy only allows its own scripts and Chart.js with SRI integrity, every input is validated and the exported CSV is protected against formula injection. No external APIs, keys or cookies: data never leaves the browser.'),
    p('In the demo, roles are UI-only. In a client version they are enforced server-side, with argon2-hashed passwords, httpOnly sessions and an audit log.'),
  ))
  texto('resultado', doc(
    p('A published demo you can use end to end: sign in as administrator or cashier, sell, record purchases, check the stock ledger, close the shift and export reports.'),
    p('To try it: user admin / demo123 or cajero / demo123. Everything is stored only in your browser and there is a button to reset the demo. The receipt has no tax validity.'),
  ))
  texto('aprendizajes', doc(
    p('The client version would use the same stack as this portfolio: Next.js, PostgreSQL (Neon) and Payload CMS on Vercel, with roles enforced on the server.'),
  ))
  const fichaEn = (en.ficha ?? {}) as Rec
  if (vacio(fichaEn.tipo) && vacio(fichaEn.periodo) && vacio(fichaEn.fuentesDatos) && vacio(fichaEn.calidad)) {
    d.ficha = {
      tipo: 'Custom web system (demo)',
      periodo: 'Fictitious business: Ferretería El Tornillo',
      fuentesDatos: 'Fictitious data, stored only in the browser',
      calidad: 'Every input validated · CSV protected against formula injection',
    }
  }
  filas('destacados', 'texto', {
    'roles: administrador y cajero': { texto: 'roles: administrator and cashier' },
    'ticket con IVA 0 % y 15 %': { texto: 'receipt with 0% and 15% VAT' },
    'reportes exportables': { texto: 'exportable reports' },
  })
  filas('hallazgos', 'cifra', {
    POS: { texto: 'blocks selling a product that is out of stock, and every purchase recalculates average cost' },
    '0': { texto: 'cookies, keys or external APIs: data never leaves the browser' },
    CSP: { texto: 'is strict, and user input is never inserted as HTML' },
    CSV: { texto: 'export protected against formula injection' },
  })
  filas('pasos', 'etiqueta', {
    '01': { titulo: 'Stock comes in', texto: 'Raises stock and recalculates cost' },
    '02': { titulo: 'Every movement', texto: 'Date, user and balance' },
    '03': { titulo: 'Point of sale', texto: 'No stock, no sale' },
    '04': { titulo: 'Shift close', texto: 'Expected vs. counted' },
    '05': { titulo: 'What sells', texto: 'By day, product and cashier' },
  })
  filas('capturas', 'ruta', {
    '/proyectos/inventario/pos.webp': {
      alt: 'Point of sale with a sale in progress: products, discounts, 0% and 15% VAT subtotals and total due. Fictitious data.',
      titulo: 'Point of sale',
      leyenda: 'The cashier searches by name, SKU or barcode, applies discounts within their limit, and the receipt separates 0% and 15% VAT subtotals.',
    },
  })
  filas('decisiones', 'titulo', {
    'Dueño': { titulo: 'Owner', texto: 'Know every day how much was sold, at what margin and which products to restock.' },
    Caja: { titulo: 'Cash drawer', texto: 'Close the shift knowing whether cash is short or over, and in which payment method.' },
    Bodega: { titulo: 'Stockroom', texto: 'See the real balance of each product and who made each movement.' },
  })
  const seoEn = (en.seo ?? {}) as Rec
  if (vacio(seoEn.titulo)) {
    d.seo = {
      titulo: 'Inventory + point of sale — case study',
      descripcion: 'Inventory and checkout demo for small businesses: point of sale, stock ledger, purchases, shift close and reports. Fictitious data.',
    }
  }
  if (PUBLICAR_INGLES && en.publicado !== true) d.publicado = true
  if (Object.keys(d).length > 0) {
    await payload.update({ collection: 'proyectos', id, locale: 'en', data: d as never })
    cambios.push(`Inventario (EN): ${Object.keys(d).join(', ')}`)
  }

  // ——— Servicio "Inventario y punto de venta": ahora con demo ———
  const serv = (
    await payload.find({ collection: 'servicios', locale: 'es', where: { nombre: { equals: 'Inventario y punto de venta' } }, limit: 1, depth: 0 })
  ).docs[0] as unknown as Rec | undefined
  if (serv && serv.estado === 'proximamente') {
    const s: Rec = { estado: 'disponible', proyectoEjemplo: id, demoUrl: DEMO }
    if (vacio(serv.herramientas)) s.herramientas = ['JavaScript', 'Chart.js', 'PostgreSQL']
    await payload.update({ collection: 'servicios', id: serv.id as number, locale: 'es', data: s as never })
    cambios.push('Servicio "Inventario y punto de venta": disponible, con demo y proyecto de ejemplo')
  }

  console.log(cambios.length ? `Cambios:\n- ${cambios.join('\n- ')}` : 'Sin cambios: todo estaba al día.')
  process.exit(0)
}

main().catch((e) => {
  console.error('Contenido v4 falló:', e instanceof Error ? e.message : e)
  process.exit(1)
})
