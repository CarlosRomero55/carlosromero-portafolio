import 'server-only'
import { Resend } from 'resend'
import type { DatosContacto } from './schema'
import { PAISES } from './schema'

/** D12: aviso a Carlos con Resend. El destino vive SOLO en CONTACT_NOTIFY_TO. */
export async function enviarAviso(d: DatosContacto): Promise<void> {
  const key = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_NOTIFY_TO
  if (!key || !to) return // Sin configuración: el mensaje queda igual guardado en el panel.
  const from = process.env.CONTACT_FROM || 'Portafolio <onboarding@resend.dev>'
  const pais = PAISES[d.pais]
  const resend = new Resend(key)
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: d.correo,
    subject: `Nuevo contacto del portafolio — ${d.nombre} ${d.apellido}`,
    text: [
      `Nombre: ${d.nombre} ${d.apellido}`,
      `Correo: ${d.correo}`,
      `País: ${pais?.es ?? d.pais}`,
      d.telefono ? `Teléfono: ${pais?.prefijo ?? ''} ${d.telefono}` : null,
      `Área: ${d.area}`,
      `Idioma de la página: ${d.idioma}`,
      '',
      d.mensaje,
      '',
      '— Responde a este correo para contestar directamente. El mensaje también está guardado en el panel.',
    ]
      .filter((x) => x !== null)
      .join('\n'),
  })
  if (error) throw new Error('aviso-no-enviado')
}
