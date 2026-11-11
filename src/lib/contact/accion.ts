'use server'

import config from '@payload-config'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import { enviarAviso } from './aviso'
import { registrarEnvio } from './ratelimit'
import { esquemaContacto, type DatosContacto, type ErroresCampo, type EstadoFormulario } from './schema'
import { verificarTurnstile } from './turnstile'
import { log } from '../log'

function ipDe(h: Headers): string {
  return h.get('x-real-ip') || h.get('x-forwarded-for')?.split(',')[0]?.trim() || 'desconocida'
}

export async function enviarContacto(_prev: EstadoFormulario, form: FormData): Promise<EstadoFormulario> {
  // 1. Campo trampa: si un bot lo llena, respondemos "éxito" y no guardamos nada.
  const trampa = form.get('sitio_web')
  if (typeof trampa === 'string' && trampa.trim() !== '') return { estado: 'ok' }

  // 2. Turnstile.
  const token = form.get('cf-turnstile-response')
  if (!(await verificarTurnstile(typeof token === 'string' ? token : ''))) {
    return { estado: 'error', motivo: 'verificacion' }
  }

  // 3. Validación en servidor con lista blanca (aunque el HTML permita otra cosa).
  const crudo = Object.fromEntries(
    ['nombre', 'apellido', 'correo', 'pais', 'telefono', 'area', 'mensaje', 'idioma'].map((k) => [
      k,
      typeof form.get(k) === 'string' ? form.get(k) : '',
    ]),
  )
  const r = esquemaContacto.safeParse(crudo)
  if (!r.success) {
    const campos: ErroresCampo = {}
    for (const issue of r.error.issues) {
      const k = issue.path[0] as keyof DatosContacto
      if (!campos[k]) campos[k] = issue.message === 'largo' || issue.message === 'correo' || issue.message === 'telefono' ? issue.message : 'requerido'
    }
    return { estado: 'error', motivo: 'validacion', campos }
  }

  try {
    const payload = await getPayload({ config })

    // 4. Límite por IP (hash + sal diaria).
    const permitido = await registrarEnvio(payload, ipDe(await headers()))
    if (!permitido) return { estado: 'error', motivo: 'limite' }

    // 5. Guardar (solo la acción de servidor puede crear mensajes).
    const d = r.data
    await payload.create({
      collection: 'mensajes',
      overrideAccess: true,
      data: {
        nombre: d.nombre,
        apellido: d.apellido,
        correo: d.correo,
        codigoPais: d.pais,
        telefono: d.telefono || undefined,
        area: d.area,
        mensaje: d.mensaje,
        idiomaEnvio: d.idioma,
      },
    })

    // 6. Aviso por correo. Si falla, el mensaje ya quedó guardado.
    try {
      await enviarAviso(d)
    } catch {
      log.warn('contacto: aviso por correo no enviado')
    }
    return { estado: 'ok' }
  } catch {
    log.error('contacto: error al guardar')
    return { estado: 'error', motivo: 'servidor' }
  }
}
