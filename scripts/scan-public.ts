/**
 * Barrido de datos internos: descarga todo lo público (páginas ES/EN, sitemap, robots, CV,
 * API sin sesión) y busca:
 *  - los enlaces de verificación y cualquier valor de campos 🔒 (leídos de la base de datos),
 *  - correos y teléfonos (no debe haber ninguno publicado),
 *  - el correo de destino de avisos (CONTACT_NOTIFY_TO).
 * Uso: BASE_URL=http://localhost:3000 pnpm test:scan
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const BASE = process.env.BASE_URL || 'http://localhost:3000'
const RUTAS = [
  '/es', '/en', '/es/sobre-mi', '/en/about', '/es/servicios', '/en/services', '/es/proyectos', '/en/projects',
  '/es/contacto', '/en/contact', '/es/privacidad', '/en/privacy', '/sitemap.xml', '/robots.txt',
  '/api/proyectos', '/api/formacion', '/api/certificaciones', '/api/mensajes', '/api/usuarios',
  '/api/globals/perfil', '/api/media',
]

const CORREO = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g
const TELEFONO = /(?:\+?\d[\d\s().-]{8,}\d)/g
// Lo único permitido: correos de ejemplo en textos de la interfaz (ninguno hoy).
const PERMITIDOS = new Set<string>([])

async function main() {
  const payload = await getPayload({ config })
  const secretos = new Set<string>()
  for (const c of ['formacion', 'certificaciones'] as const) {
    const { docs } = await payload.find({ collection: c, limit: 500, locale: 'all', showHiddenFields: true })
    for (const d of docs as { verificacionInterna?: string | null }[]) if (d.verificacionInterna) secretos.add(d.verificacionInterna)
  }
  const { docs: proyectos } = await payload.find({ collection: 'proyectos', limit: 500, locale: 'all' })
  for (const p of proyectos as { notasInternas?: Record<string, string> | string | null }[]) {
    const n = p.notasInternas
    for (const v of typeof n === 'object' && n ? Object.values(n) : [n]) if (v && v.length > 12) secretos.add(v.slice(0, 60))
  }
  if (process.env.CONTACT_NOTIFY_TO) secretos.add(process.env.CONTACT_NOTIFY_TO)

  const textos: [string, string][] = []
  for (const r of RUTAS) textos.push([r, await (await fetch(BASE + r)).text()])
  // CV: se busca en el texto del PDF sin comprimir no es fiable; se comprueba que no lleve los secretos crudos.
  for (const r of ['/es/cv.pdf', '/en/cv.pdf']) textos.push([r, Buffer.from(await (await fetch(BASE + r)).arrayBuffer()).toString('latin1')])

  const hallazgos: string[] = []
  for (const [ruta, t] of textos) {
    for (const s of secretos) if (t.includes(s)) hallazgos.push(`${ruta}: contiene un valor interno`)
    if (ruta.endsWith('.pdf')) continue
    const visible = t.replace(/<script[^>]*>[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ')
    for (const m of visible.match(CORREO) ?? []) if (!PERMITIDOS.has(m)) hallazgos.push(`${ruta}: correo publicado (${m.replace(/^(.).*@/, '$1***@')})`)
    for (const m of visible.match(TELEFONO) ?? []) if (/\d{9,}/.test(m.replace(/\D/g, ''))) hallazgos.push(`${ruta}: posible teléfono (${m.slice(0, 4)}…)`)
  }

  console.log(`Barrido: ${textos.length} recursos, ${secretos.size} valores internos buscados.`)
  if (hallazgos.length) {
    console.error(hallazgos.join('\n'))
    process.exit(1)
  }
  console.log('0 coincidencias. OK')
  process.exit(0)
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exit(1)
})
