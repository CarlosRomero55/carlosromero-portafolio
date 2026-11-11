import 'server-only'
import { createHmac } from 'node:crypto'
import type { Payload } from 'payload'

export const LIMITE_DIARIO = 5

function secreto(): string {
  const s = process.env.RATE_LIMIT_SECRET || process.env.PAYLOAD_SECRET
  if (!s) throw new Error('Falta RATE_LIMIT_SECRET')
  return s
}

export function ventanaHoy(ahora = new Date()): string {
  return ahora.toISOString().slice(0, 10)
}

/** D9: HMAC-SHA256 de la IP con una sal que cambia cada día. La IP nunca se guarda. */
export function claveIP(ip: string, ventana = ventanaHoy()): string {
  const sal = createHmac('sha256', secreto()).update(`sal:${ventana}`).digest()
  return createHmac('sha256', sal).update(ip).digest('hex')
}

/** Suma un envío y devuelve true si todavía está dentro del límite. */
export async function registrarEnvio(payload: Payload, ip: string): Promise<boolean> {
  const ventana = ventanaHoy()
  const clave = claveIP(ip, ventana)

  // Limpieza: borra ventanas de días anteriores (retención de 24 h).
  await payload.delete({ collection: 'rateLimit', where: { ventana: { not_equals: ventana } }, overrideAccess: true })

  const { docs } = await payload.find({
    collection: 'rateLimit',
    where: { and: [{ clave: { equals: clave } }, { ventana: { equals: ventana } }] },
    limit: 1,
    overrideAccess: true,
  })
  const actual = docs[0] as { id: number | string; conteo: number } | undefined
  if (actual && actual.conteo >= LIMITE_DIARIO) return false
  if (actual) {
    await payload.update({ collection: 'rateLimit', id: actual.id, data: { conteo: actual.conteo + 1 }, overrideAccess: true })
  } else {
    await payload.create({ collection: 'rateLimit', data: { clave, ventana, conteo: 1 }, overrideAccess: true })
  }
  return true
}
