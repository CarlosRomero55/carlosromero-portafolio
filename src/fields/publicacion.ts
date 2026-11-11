import type { Field } from 'payload'

export const MARCA_PENDIENTE = '[completar]'

/** Devuelve true si un valor (texto, número o richText de Lexical) tiene contenido real. */
export function tieneContenido(valor: unknown): boolean {
  if (valor === null || valor === undefined) return false
  if (typeof valor === 'number') return true
  if (typeof valor === 'string') {
    const t = valor.trim()
    return t.length > 0 && !t.includes(MARCA_PENDIENTE)
  }
  if (typeof valor === 'object' && valor && 'root' in valor) {
    const texto = JSON.stringify(valor)
    if (texto.includes(MARCA_PENDIENTE)) return false
    return /"text":"[^"]*\S[^"]*"/.test(texto)
  }
  if (typeof valor === 'object') return true
  return false
}

/**
 * D3: casilla "Publicado en este idioma" (localizada).
 * Solo se puede marcar si los campos obligatorios del idioma que se está editando
 * están llenos y no contienen la marca [completar].
 */
export function campoPublicado(obligatorios: string[]): Field {
  return {
    name: 'publicado',
    type: 'checkbox',
    localized: true,
    defaultValue: false,
    label: { es: 'Publicado en este idioma', en: 'Published in this language' },
    admin: {
      position: 'sidebar',
      description: {
        es: 'Solo se puede marcar si todos los campos obligatorios de este idioma están completos. Si no se marca, la pieza no aparece en este idioma.',
        en: 'Can only be checked when every required field in this language is complete.',
      },
    },
    validate: (valor: boolean | null | undefined, { siblingData }) => {
      if (!valor) return true
      const datos = siblingData as Record<string, unknown>
      const faltan = obligatorios.filter((campo) => {
        const partes = campo.split('.')
        let actual: unknown = datos
        for (const p of partes) actual = (actual as Record<string, unknown> | undefined)?.[p]
        return !tieneContenido(actual)
      })
      if (faltan.length === 0) return true
      return `No se puede publicar en este idioma: faltan o tienen ${MARCA_PENDIENTE} estos campos → ${faltan.join(', ')}`
    },
  }
}

export const campoOrden: Field = {
  name: 'orden',
  type: 'number',
  defaultValue: 0,
  admin: { position: 'sidebar', description: 'Menor número = aparece primero' },
}
