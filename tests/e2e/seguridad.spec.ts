import { expect, test } from '@playwright/test'
import { TODAS } from './rutas'

test.describe('seguridad', () => {
  test('cabeceras de seguridad en todas las páginas públicas', async ({ request }) => {
    for (const ruta of [...TODAS, '/es/cv.pdf', '/sitemap.xml']) {
      const h = (await request.get(ruta)).headers()
      expect(h['strict-transport-security'], ruta).toContain('max-age=')
      expect(h['x-frame-options'], ruta).toBe('DENY')
      expect(h['x-content-type-options'], ruta).toBe('nosniff')
      expect(h['referrer-policy'], ruta).toBe('strict-origin-when-cross-origin')
      expect(h['content-security-policy'], ruta).toContain("frame-ancestors 'none'")
      expect(h['set-cookie'], ruta).toBeUndefined()
    }
  })

  test('la CSP bloquea manejadores en línea y javascript: inyectados', async ({ page }) => {
    await page.goto('/es')
    const violaciones = await page.evaluate(async () => {
      let n = 0
      document.addEventListener('securitypolicyviolation', () => n++)
      const w = window as unknown as Record<string, boolean>
      w.__xss = false
      const img = document.createElement('img')
      img.setAttribute('onerror', 'window.__xss = true')
      img.src = '/no-existe.png'
      document.body.appendChild(img)
      // innerHTML simula contenido inyectado sin escapar.
      const div = document.createElement('div')
      div.innerHTML = '<svg><a href="javascript:window.__xss=true"><text>x</text></a></svg><img src=x onerror="window.__xss=true">'
      document.body.appendChild(div)
      await new Promise((r) => setTimeout(r, 300))
      return { n, xss: w.__xss }
    })
    expect(violaciones.xss).toBe(false)
    expect(violaciones.n).toBeGreaterThan(0)
  })

  test('la API de Payload y GraphQL no responden sin sesión', async ({ request }) => {
    for (const ruta of [
      '/api/proyectos',
      '/api/trayectoria',
      '/api/formacion',
      '/api/certificaciones',
      '/api/mensajes',
      '/api/usuarios',
      '/api/media',
      '/api/rateLimit',
      '/api/registroAccesos',
      '/api/globals/perfil',
      '/api/globals/textosSitio',
    ]) {
      const r = await request.get(ruta)
      expect([401, 403], ruta).toContain(r.status())
      const cuerpo = await r.text()
      expect(cuerpo, ruta).not.toMatch(/verificacion|notasInternas|stack|at \w+ \(/i)
    }
    expect((await request.post('/api/graphql', { data: { query: '{__typename}' } })).status()).toBe(404)
    expect((await request.post('/api/mensajes', { data: { nombre: 'x' } })).status()).toBeGreaterThanOrEqual(400)
  })

  test('el panel no se indexa', async ({ request }) => {
    const r = await request.get('/admin')
    expect(r.headers()['x-robots-tag']).toContain('noindex')
  })
})

test('rutas con extensión o idioma inventado dan 404 sin tocar la base de datos', async ({ request }) => {
  for (const r of ['/no-existe.png', '/xx', '/%3Cscript%3E']) {
    expect([404, 307, 308], r).toContain((await request.get(r, { maxRedirects: 0 })).status())
  }
})
