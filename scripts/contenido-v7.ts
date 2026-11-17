/**
 * Contenido v7 (17 nov 2026): proyecto "Sitio web para tienda de repuestos" (demo-sitio-web-negocio, GitHub Pages).
 *
 * Fuente: docs/ficha-sitio-web-negocio.json y README del repositorio CarlosRomero55/demo-sitio-web-negocio.
 * Mismas reglas que v4: crea en español (publicado) solo si no existe, nunca pisa lo editado en el panel,
 * el inglés queda sin publicar salvo PUBLICAR_INGLES=true. Negocio ficticio (Refri House).
 * Uso: pnpm contenido:v7
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { doc, p, ul } from './lexical'

type Rec = Record<string, unknown>

const PUBLICAR_INGLES = process.env.PUBLICAR_INGLES === 'true'
const SLUG = 'sitio-web-tienda-repuestos'
const DEMO = 'https://carlosromero55.github.io/demo-sitio-web-negocio/'
const REPO = 'https://github.com/CarlosRomero55/demo-sitio-web-negocio'

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
        orden: 5,
        destacado: false,
        titulo: 'Sitio web para tienda de repuestos de línea blanca',
        slug: SLUG,
        area: 'web',
        titular: 'Cada visita termina en una cotización por WhatsApp con el repuesto ya escrito, y el servicio técnico se agenda en línea.',
        resumen: 'Sitio completo de 7 páginas para Refri House, una tienda ficticia de repuestos y servicio técnico en Guayaquil: catálogo con buscador, cotización por WhatsApp y agenda conectada al sistema de citas.',
        tecnologias: ['HTML', 'CSS', 'JavaScript', 'Schema.org', 'Playwright'],
        portadaRuta: '/proyectos/refri/inicio.webp',
        portadaAlt: 'Página de inicio de Refri House: titular, botones para ver el catálogo y cotizar por WhatsApp, buscador de repuestos e ilustración de electrodomésticos. Negocio ficticio.',
        portadaEtiqueta: 'Demo en línea',
        destacados: [
          { cifra: '7', texto: 'páginas: inicio, catálogo, servicio técnico, nosotros, blog, contacto y 404' },
          { cifra: '24', texto: 'repuestos con búsqueda sin tildes, filtros y orden por precio' },
          { cifra: '100', texto: 'en rendimiento, accesibilidad y buenas prácticas (Lighthouse, móvil)' },
        ],
        hallazgos: [
          { cifra: '1 clic', texto: 'del repuesto a WhatsApp, con el nombre y el código ya escritos', tono: 'destacado' },
          { cifra: 'CSP', texto: 'sin scripts ni estilos en línea; los datos del visitante nunca se insertan como HTML', tono: 'normal' },
          { cifra: '0', texto: 'claves, analítica o scripts de terceros; el mapa solo carga si el visitante lo pide', tono: 'normal' },
          { cifra: 'AA', texto: 'contraste verificado, menú y galería usables con teclado, modo oscuro', tono: 'normal' },
        ],
        ficha: {
          tipo: 'Sitio web para negocio local (demo)',
          periodo: 'Negocio ficticio: Refri House, Guayaquil',
          fuentesDatos: 'Catálogo, precios y testimonios ficticios',
          calidad: 'HTML válido en las 7 páginas · pruebas automáticas con Playwright',
        },
        preguntaNegocio: '¿Cómo puede una tienda de repuestos dejar de responder los mismos precios por WhatsApp todo el día y aparecer cuando alguien busca un repuesto en Google?',
        problema: doc(
          p('Los negocios de repuestos atienden casi todo por teléfono y WhatsApp: el cliente no sabe qué pieza necesita, pregunta precios uno por uno y el vendedor repite la misma información todo el día. Sin presencia web, el negocio no aparece cuando alguien busca un repuesto en Google.'),
        ),
        metodo: doc(
          p('Un sitio rápido y pensado para el celular que muestra el catálogo con precios referenciales, ayuda al cliente a identificar su repuesto y convierte cada visita en una cotización por WhatsApp con el producto ya escrito. El servicio técnico se agenda en línea, conectado con el sistema de citas y facturación.'),
          ul([
            'Inicio con buscador de repuestos, categorías, productos más pedidos, testimonios rotulados como ficticios y preguntas frecuentes.',
            'Catálogo de 24 repuestos con búsqueda sin tildes, filtros por categoría, orden por precio y enlaces ya filtrados.',
            'Botón «Cotizar» que abre WhatsApp con el nombre y el código del repuesto.',
            'Servicio técnico con precios y duración; «Agendar» lleva a la demo de citas y facturación.',
            'Nosotros con galería accesible por teclado, blog con 3 artículos y formulario de contacto con validación de teléfono ecuatoriano.',
            'Modo oscuro automático y manual, menú móvil accesible, botón flotante de WhatsApp y página 404 propia.',
          ]),
        ),
        datosLimpieza: doc(
          p('Seguridad en la demo: Content Security Policy sin scripts ni estilos en línea, datos del visitante insertados solo como texto, campo trampa anti-spam, tiempo mínimo de llenado y límite de 3 envíos por sesión. El formulario de la demo no envía ni guarda datos, y el mapa de terceros solo se carga con permiso del visitante.'),
          p('En una versión para un cliente, el formulario se valida en el servidor y avisa por correo con protección anti-bots, el contenido se edita desde un panel (repuestos, precios, servicios y blog) y el sitio se publica con dominio propio, Google Search Console y analítica sin cookies.'),
        ),
        pasos: [
          { etiqueta: '01', titulo: 'Encontrar', texto: 'Google y buscador', color: 'ninguno' },
          { etiqueta: '02', titulo: 'Identificar', texto: 'Filtros y código', color: 'ninguno' },
          { etiqueta: '03', titulo: 'Cotizar', texto: 'WhatsApp prellenado', color: 'ninguno' },
          { etiqueta: '04', titulo: 'Agendar', texto: 'Técnico a domicilio', color: 'ninguno' },
          { etiqueta: '05', titulo: 'Facturar', texto: 'En el sistema de citas', color: 'ninguno' },
        ],
        resultado: doc(
          p('Un sitio publicado que se navega como el de un negocio real, desde el celular o la computadora, con Lighthouse 100 en rendimiento, accesibilidad y buenas prácticas en todas las páginas. Funciona junto con la demo de citas y facturación: el cliente agenda la visita técnica y el negocio la factura desde su sistema.'),
          p('Refri House es un negocio ficticio: los productos, precios, personas y testimonios son de ejemplo, y las marcas de electrodomésticos aparecen solo en texto, sin afiliación.'),
        ),
        capturas: [
          {
            ruta: '/proyectos/refri/catalogo.webp',
            alt: 'Catálogo de Refri House con buscador, orden por precio, filtros por categoría con su cantidad de repuestos y las primeras tarjetas de productos. Negocio ficticio.',
            titulo: 'Catálogo con buscador',
            leyenda: 'Búsqueda sin tildes, filtros por categoría y orden por precio; cada repuesto tiene su botón para cotizar por WhatsApp.',
          },
          {
            ruta: '/proyectos/refri/servicio.webp',
            alt: 'Página de servicio técnico con garantía de 60 días, atención en 24 a 48 horas, diagnóstico de $15 y botones para agendar o consultar por WhatsApp. Negocio ficticio.',
            titulo: 'Servicio técnico',
            leyenda: 'Precios y tiempos a la vista; «Agendar visita» abre la demo de citas con el servicio ya elegido.',
          },
          {
            ruta: '/proyectos/refri/movil.webp',
            alt: 'Inicio de Refri House en un celular, con menú compacto, titular, botones y buscador. Negocio ficticio.',
            titulo: 'En el celular',
            leyenda: 'Pensado primero para el celular, que es desde donde llegan la mayoría de clientes de un negocio local.',
          },
        ],
        decisiones: [
          { titulo: 'Cliente', texto: 'Encontrar su repuesto y pedir precio sin llamar ni esperar.' },
          { titulo: 'Vendedor', texto: 'Recibir cotizaciones con el producto ya identificado, no preguntas sueltas.' },
          { titulo: 'Dueño', texto: 'Aparecer en Google y llenar la agenda del servicio técnico.' },
        ],
        aprendizajes: doc(
          p('La versión para un cliente usaría el mismo stack de este portafolio: Next.js y Payload CMS en Vercel, para que el dueño actualice repuestos, precios y servicios sin depender de un programador.'),
        ),
        demo: DEMO,
        repositorio: REPO,
        contieneDatosSimulados: true,
        seo: {
          titulo: 'Sitio web para tienda de repuestos — caso de estudio',
          descripcion: 'Sitio de 7 páginas para un negocio local ficticio: catálogo con buscador, cotización por WhatsApp y agenda de servicio técnico.',
        },
      } as never,
    })) as unknown as Rec
    cambios.push('Sitio web para tienda de repuestos: creado y publicado en español')
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

  texto('titulo', 'Website for a home appliance spare parts store')
  texto('slug', 'spare-parts-store-website')
  texto('titular', 'Every visit ends in a WhatsApp quote with the part already filled in, and repair visits are booked online.')
  texto('resumen', 'A complete 7-page website for Refri House, a fictional spare parts and repair shop in Guayaquil: searchable catalog, WhatsApp quotes and booking linked to the appointments system.')
  texto('portadaAlt', 'Refri House home page: headline, buttons to browse the catalog and get a WhatsApp quote, part search box and an illustration of home appliances. Fictitious business.')
  texto('portadaEtiqueta', 'Live demo')
  texto('preguntaNegocio', 'How can a spare parts store stop answering the same price questions on WhatsApp all day and show up when someone searches for a part on Google?')
  texto('problema', doc(
    p('Spare parts shops handle almost everything by phone and WhatsApp: customers don’t know which part they need, ask for prices one by one, and staff repeat the same information all day. Without a website, the business doesn’t show up when someone searches for a part on Google.'),
  ))
  texto('metodo', doc(
    p('A fast, mobile-first website that shows the catalog with reference prices, helps customers identify their part, and turns each visit into a WhatsApp quote with the product already filled in. Repair visits are booked online, connected to the appointments and invoicing system.'),
    ul([
      'Home page with part search, categories, best sellers, testimonials labeled as fictitious and FAQ.',
      'Catalog of 24 parts with accent-insensitive search, category filters, price sorting and pre-filtered links.',
      'Quote button that opens WhatsApp with the part name and code.',
      'Repair service page with prices and duration; “Book” opens the appointments and invoicing demo.',
      'About page with a keyboard-accessible gallery, a blog with 3 articles and a contact form with Ecuadorian phone validation.',
      'Automatic and manual dark mode, accessible mobile menu, floating WhatsApp button and a custom 404 page.',
    ]),
  ))
  texto('datosLimpieza', doc(
    p('Security in the demo: Content Security Policy with no inline scripts or styles, visitor input rendered only as text, an anti-spam honeypot, a minimum fill time and a limit of 3 submissions per session. The demo form does not send or store any data, and the third-party map loads only with the visitor’s consent.'),
    p('In a client version, the form is validated on the server and sends an email notification with bot protection, content is edited from an admin panel (parts, prices, services and blog), and the site goes live with its own domain, Google Search Console and cookieless analytics.'),
  ))
  texto('resultado', doc(
    p('A published website that works like a real business’s, on a phone or a computer, scoring 100 in Lighthouse performance, accessibility and best practices on every page. It works together with the appointments and invoicing demo: the customer books the repair visit and the business invoices it from its system.'),
    p('Refri House is a fictitious business: products, prices, people and testimonials are examples, and appliance brands appear only as text, with no affiliation.'),
  ))
  texto('aprendizajes', doc(
    p('The client version would use the same stack as this portfolio: Next.js and Payload CMS on Vercel, so the owner can update parts, prices and services without depending on a developer.'),
  ))
  const fichaEn = (en.ficha ?? {}) as Rec
  if (vacio(fichaEn.tipo) && vacio(fichaEn.periodo) && vacio(fichaEn.fuentesDatos) && vacio(fichaEn.calidad)) {
    d.ficha = {
      tipo: 'Website for a local business (demo)',
      periodo: 'Fictitious business: Refri House, Guayaquil',
      fuentesDatos: 'Fictitious catalog, prices and testimonials',
      calidad: 'Valid HTML on all 7 pages · automated tests with Playwright',
    }
  }
  filas('destacados', 'cifra', {
    '7': { texto: 'pages: home, catalog, repair service, about, blog, contact and 404' },
    '24': { texto: 'parts with accent-insensitive search, filters and price sorting' },
    '100': { texto: 'in performance, accessibility and best practices (Lighthouse, mobile)' },
  })
  filas('hallazgos', 'cifra', {
    '1 clic': { texto: 'from the part to WhatsApp, with its name and code already filled in' },
    CSP: { texto: 'with no inline scripts or styles; visitor input is never inserted as HTML' },
    '0': { texto: 'API keys, analytics or third-party scripts; the map loads only if the visitor asks' },
    AA: { texto: 'contrast verified, keyboard-friendly menu and gallery, dark mode' },
  })
  filas('pasos', 'etiqueta', {
    '01': { titulo: 'Find', texto: 'Google and search' },
    '02': { titulo: 'Identify', texto: 'Filters and part code' },
    '03': { titulo: 'Quote', texto: 'Pre-filled WhatsApp' },
    '04': { titulo: 'Book', texto: 'Home repair visit' },
    '05': { titulo: 'Invoice', texto: 'In the appointments system' },
  })
  filas('capturas', 'ruta', {
    '/proyectos/refri/catalogo.webp': {
      alt: 'Refri House catalog with search box, price sorting, category filters with their part counts and the first product cards. Fictitious business.',
      titulo: 'Searchable catalog',
      leyenda: 'Accent-insensitive search, category filters and price sorting; every part has its own WhatsApp quote button.',
    },
    '/proyectos/refri/servicio.webp': {
      alt: 'Repair service page with a 60-day warranty, 24 to 48-hour response, a $15 diagnostic fee and buttons to book or ask on WhatsApp. Fictitious business.',
      titulo: 'Repair service',
      leyenda: 'Prices and response times in plain sight; “Book a visit” opens the appointments demo with the service already selected.',
    },
    '/proyectos/refri/movil.webp': {
      alt: 'Refri House home page on a phone, with compact menu, headline, buttons and search box. Fictitious business.',
      titulo: 'On a phone',
      leyenda: 'Designed mobile-first, since that is where most customers of a local business come from.',
    },
  })
  filas('decisiones', 'titulo', {
    Cliente: { titulo: 'Customer', texto: 'Find the right part and ask for a price without calling or waiting.' },
    Vendedor: { titulo: 'Sales staff', texto: 'Receive quote requests with the product already identified, not loose questions.' },
    'Dueño': { titulo: 'Owner', texto: 'Show up on Google and fill the repair service schedule.' },
  })
  const seoEn = (en.seo ?? {}) as Rec
  if (vacio(seoEn.titulo)) {
    d.seo = {
      titulo: 'Website for a spare parts store — case study',
      descripcion: '7-page website for a fictitious local business: searchable catalog, WhatsApp quotes and repair service booking.',
    }
  }
  if (PUBLICAR_INGLES && en.publicado !== true) d.publicado = true
  if (Object.keys(d).length > 0) {
    await payload.update({ collection: 'proyectos', id, locale: 'en', data: d as never })
    cambios.push(`Sitio web (EN): ${Object.keys(d).join(', ')}`)
  }

  console.log(cambios.length ? `Cambios:\n- ${cambios.join('\n- ')}` : 'Sin cambios: todo estaba al día.')
  process.exit(0)
}

main().catch((e) => {
  console.error('Contenido v7 falló:', e instanceof Error ? e.message : e)
  process.exit(1)
})
