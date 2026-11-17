/**
 * Contenido v8 (17 nov 2026): servicio "Diseño de páginas web" con la demo de Refri House como ejemplo.
 * Crea el servicio en español (publicado) solo si no existe; llena el inglés si está vacío y lo publica
 * solo con PUBLICAR_INGLES=true. Nunca pisa lo editado en el panel. Uso: pnpm contenido:v8
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

type Rec = Record<string, unknown>
const PUBLICAR_INGLES = process.env.PUBLICAR_INGLES === 'true'
const NOMBRE = 'Diseño de páginas web'
const DEMO = 'https://carlosromero55.github.io/demo-sitio-web-negocio/'

const ENTREGABLES: [string, string][] = [
  ['Sitio rápido y pensado para el celular', 'Fast, mobile-first website'],
  ['Catálogo o servicios con cotización por WhatsApp', 'Catalog or services with WhatsApp quotes'],
  ['Formulario seguro y aparición en Google', 'Secure contact form and Google visibility'],
  ['Panel para editar textos, precios y fotos', 'Admin panel to edit text, prices and photos'],
]

const vacio = (v: unknown) => v === null || v === undefined || v === '' || (Array.isArray(v) && v.length === 0)

async function main() {
  const payload = await getPayload({ config })
  const cambios: string[] = []

  const ejemplo = (
    await payload.find({ collection: 'proyectos', locale: 'es', where: { slug: { equals: 'sitio-web-tienda-repuestos' } }, limit: 1, depth: 0 })
  ).docs[0]

  let servicio = (
    await payload.find({ collection: 'servicios', locale: 'es', where: { nombre: { equals: NOMBRE } }, limit: 1, depth: 0 })
  ).docs[0] as unknown as Rec | undefined

  if (!servicio) {
    servicio = (await payload.create({
      collection: 'servicios',
      locale: 'es',
      data: {
        publicado: true,
        orden: 6,
        nombre: NOMBRE,
        descripcion: 'Tu negocio en Google, con catálogo y cotización por WhatsApp.',
        dolor: 'Respondo los mismos precios por WhatsApp todo el día.',
        grupo: 'sistemas',
        icono: 'pantalla',
        herramientas: ['HTML', 'CSS', 'JavaScript', 'Next.js'],
        entregables: ENTREGABLES.map(([texto]) => ({ texto })),
        estado: 'disponible',
        proyectoEjemplo: ejemplo?.id ?? null,
        demoUrl: DEMO,
      } as never,
    })) as unknown as Rec
    cambios.push(`Servicio "${NOMBRE}": creado y publicado en español`)
  }

  // ——— Inglés ———
  const id = servicio.id as number
  const es = (await payload.findByID({ collection: 'servicios', id, locale: 'es', fallbackLocale: false, depth: 0 })) as unknown as Rec
  const en = (await payload.findByID({ collection: 'servicios', id, locale: 'en', fallbackLocale: false, depth: 0 })) as unknown as Rec
  const d: Rec = {}
  if (vacio(en.nombre)) d.nombre = 'Website design'
  if (vacio(en.descripcion)) d.descripcion = 'Your business on Google, with a catalog and WhatsApp quotes.'
  if (vacio(en.dolor)) d.dolor = 'I answer the same price questions on WhatsApp all day.'
  const filasEs = Array.isArray(es.entregables) ? (es.entregables as Rec[]) : []
  const filasEn = Array.isArray(en.entregables) ? (en.entregables as Rec[]) : []
  const mapa: Record<string, string> = Object.fromEntries(ENTREGABLES)
  // Solo si todas las filas en español siguen siendo las originales (si las editaste, el inglés lo llenas tú).
  if (filasEs.length > 0 && filasEs.every((f) => String(f.texto) in mapa) && filasEs.some((_, i) => vacio(filasEn[i]?.texto))) {
    d.entregables = filasEs.map((f, i) => ({
      id: f.id,
      texto: vacio(filasEn[i]?.texto) ? mapa[String(f.texto)] ?? '' : filasEn[i].texto,
    }))
  }
  if (PUBLICAR_INGLES && en.publicado !== true) d.publicado = true
  if (Object.keys(d).length > 0) {
    await payload.update({ collection: 'servicios', id, locale: 'en', data: d as never })
    cambios.push(`Servicio (EN): ${Object.keys(d).join(', ')}`)
  }

  console.log(cambios.length ? `Cambios:\n- ${cambios.join('\n- ')}` : 'Sin cambios: todo estaba al día.')
  process.exit(0)
}

main().catch((e) => {
  console.error('Contenido v8 falló:', e instanceof Error ? e.message : e)
  process.exit(1)
})
