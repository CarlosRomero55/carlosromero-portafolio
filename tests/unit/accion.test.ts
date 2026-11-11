import { describe, expect, it, vi } from 'vitest'

process.env.RATE_LIMIT_SECRET = 'prueba'
const crear = vi.fn()
vi.mock('next/headers', () => ({ headers: async () => new Headers({ 'x-real-ip': '192.0.2.1' }) }))
vi.mock('@payload-config', () => ({ default: {} }))
vi.mock('payload', () => ({
  getPayload: async () => ({
    create: crear,
    delete: vi.fn(),
    find: vi.fn(async () => ({ docs: [] })),
    update: vi.fn(),
  }),
}))
vi.mock('@/lib/contact/turnstile', () => ({ verificarTurnstile: async (t: string) => t === 'ok' }))
vi.mock('@/lib/contact/aviso', () => ({ enviarAviso: vi.fn() }))

const { enviarContacto } = await import('@/lib/contact/accion')

function form(extra: Record<string, string> = {}) {
  const f = new FormData()
  const base: Record<string, string> = {
    nombre: 'Ana',
    apellido: 'Pérez',
    correo: 'ana@example.com',
    pais: 'EC',
    telefono: '',
    area: 'otro',
    mensaje: 'Hola',
    idioma: 'es',
    'cf-turnstile-response': 'ok',
    sitio_web: '',
    ...extra,
  }
  for (const [k, v] of Object.entries(base)) f.set(k, v)
  return f
}

describe('acción de contacto', () => {
  it('campo trampa lleno → "éxito" falso y nada guardado', async () => {
    crear.mockClear()
    expect(await enviarContacto({ estado: 'inicial' }, form({ sitio_web: 'http://spam' }))).toEqual({ estado: 'ok' })
    expect(crear).not.toHaveBeenCalled()
  })
  it('sin Turnstile válido → error de verificación, nada guardado', async () => {
    crear.mockClear()
    const r = await enviarContacto({ estado: 'inicial' }, form({ 'cf-turnstile-response': 'malo' }))
    expect(r).toMatchObject({ estado: 'error', motivo: 'verificacion' })
    expect(crear).not.toHaveBeenCalled()
  })
  it('datos inválidos → errores por campo, nada guardado', async () => {
    crear.mockClear()
    const r = await enviarContacto({ estado: 'inicial' }, form({ correo: 'x', area: 'zzz' }))
    expect(r).toMatchObject({ estado: 'error', motivo: 'validacion', campos: { correo: 'correo', area: 'requerido' } })
    expect(crear).not.toHaveBeenCalled()
  })
  it('envío válido se guarda solo con campos de la lista blanca', async () => {
    crear.mockClear()
    const r = await enviarContacto({ estado: 'inicial' }, form({ extra: 'no-debe-guardarse' }))
    expect(r).toEqual({ estado: 'ok' })
    const datos = crear.mock.calls.find((c) => c[0].collection === 'mensajes')?.[0].data
    expect(Object.keys(datos).sort()).toEqual(
      ['apellido', 'area', 'codigoPais', 'correo', 'idiomaEnvio', 'mensaje', 'nombre', 'telefono'].sort(),
    )
  })
})
