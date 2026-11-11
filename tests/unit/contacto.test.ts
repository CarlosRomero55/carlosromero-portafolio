import { beforeEach, describe, expect, it, vi } from 'vitest'
import { esquemaContacto } from '@/lib/contact/schema'
import { claveIP, LIMITE_DIARIO, registrarEnvio } from '@/lib/contact/ratelimit'

const valido = {
  nombre: 'Ana',
  apellido: 'Pérez',
  correo: 'ana@example.com',
  pais: 'EC',
  telefono: '099 123 4567',
  area: 'analisis',
  mensaje: 'Hola, tengo un proyecto.',
  idioma: 'es',
}

describe('esquema del formulario (servidor)', () => {
  it('acepta un envío válido y normaliza el teléfono', () => {
    const r = esquemaContacto.safeParse(valido)
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.telefono).toBe('0991234567')
  })
  it.each([
    ['nombre demasiado largo', { nombre: 'a'.repeat(61) }],
    ['correo inválido', { correo: 'no-es-correo' }],
    ['teléfono con letras', { telefono: '09abc' }],
    ['área fuera de la lista', { area: 'hackeo' }],
    ['país fuera de la lista', { pais: 'XX' }],
    ['idioma fuera de la lista', { idioma: 'fr' }],
    ['mensaje vacío', { mensaje: '   ' }],
    ['mensaje > 2000', { mensaje: 'x'.repeat(2001) }],
    ['caracteres de control', { nombre: 'Ana\u0000' }],
  ])('rechaza: %s', (_n, cambio) => {
    expect(esquemaContacto.safeParse({ ...valido, ...cambio }).success).toBe(false)
  })
  it('teléfono vacío es válido (opcional)', () => {
    expect(esquemaContacto.safeParse({ ...valido, telefono: '' }).success).toBe(true)
  })
})

describe('límite por IP', () => {
  beforeEach(() => {
    process.env.RATE_LIMIT_SECRET = 'prueba-secreta'
  })
  it('no guarda la IP en claro y la clave cambia cada día', () => {
    const a = claveIP('203.0.113.7', '2026-11-11')
    expect(a).not.toContain('203.0.113.7')
    expect(a).toMatch(/^[a-f0-9]{64}$/)
    expect(claveIP('203.0.113.7', '2026-11-12')).not.toBe(a)
  })
  it(`bloquea el envío número ${LIMITE_DIARIO + 1}`, async () => {
    const filas: { id: number; clave: string; ventana: string; conteo: number }[] = []
    const payload = {
      delete: vi.fn(async () => ({})),
      find: vi.fn(async ({ where }: { where: { and: { clave?: { equals: string } }[] } }) => ({
        docs: filas.filter((f) => f.clave === where.and[0].clave?.equals),
      })),
      update: vi.fn(async ({ id, data }: { id: number; data: { conteo: number } }) => {
        filas.find((f) => f.id === id)!.conteo = data.conteo
      }),
      create: vi.fn(async ({ data }: { data: { clave: string; ventana: string; conteo: number } }) => {
        filas.push({ id: filas.length + 1, ...data })
      }),
    }
    const resultados = []
    for (let i = 0; i < LIMITE_DIARIO + 1; i++) resultados.push(await registrarEnvio(payload as never, '198.51.100.1'))
    expect(resultados.slice(0, LIMITE_DIARIO).every(Boolean)).toBe(true)
    expect(resultados[LIMITE_DIARIO]).toBe(false)
    expect(JSON.stringify(filas)).not.toContain('198.51.100.1')
  })
})
