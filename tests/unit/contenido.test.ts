import { describe, expect, it } from 'vitest'
import es from '@/i18n/messages/es.json'
import en from '@/i18n/messages/en.json'
import { tieneContenido } from '@/fields/publicacion'
import { sanear } from '@/lib/lexical'

function claves(o: object, pre = ''): string[] {
  return Object.entries(o).flatMap(([k, v]) => (typeof v === 'object' ? claves(v, `${pre}${k}.`) : [`${pre}${k}`]))
}

describe('textos de interfaz', () => {
  it('es.json y en.json tienen exactamente las mismas claves', () => {
    expect(claves(es).sort()).toEqual(claves(en).sort())
  })
})

describe('regla de publicación por idioma', () => {
  it('vacío o con [completar] no cuenta como contenido', () => {
    expect(tieneContenido('')).toBe(false)
    expect(tieneContenido('  ')).toBe(false)
    expect(tieneContenido('Texto [completar]')).toBe(false)
    expect(tieneContenido(null)).toBe(false)
    expect(tieneContenido('Listo')).toBe(true)
  })
  it('texto enriquecido vacío no cuenta', () => {
    expect(tieneContenido({ root: { children: [{ type: 'paragraph', children: [] }] } })).toBe(false)
    expect(tieneContenido({ root: { children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Hola' }] }] } })).toBe(true)
  })
})

describe('saneador de texto enriquecido', () => {
  it('quita enlaces javascript: y conserva el texto', () => {
    const datos = {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'link', fields: { url: 'javascript:alert(1)', linkType: 'custom' }, children: [{ type: 'text', text: 'clic' }] }],
          },
        ],
      },
    }
    const s = JSON.stringify(sanear(datos))
    expect(s).not.toContain('javascript:')
    expect(s).toContain('clic')
  })
  it('conserva enlaces https', () => {
    const datos = { root: { type: 'root', children: [{ type: 'link', fields: { url: 'https://bce.fin.ec' }, children: [] }] } }
    expect(JSON.stringify(sanear(datos))).toContain('https://bce.fin.ec')
  })
})
