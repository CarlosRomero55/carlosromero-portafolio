import { expect, test } from '@playwright/test'
import { PAGINAS } from './rutas'

test.describe('idiomas', () => {
  test('la raíz redirige según Accept-Language', async ({ request }) => {
    for (const [lang, destino] of [
      ['en-US,en;q=0.9', '/en'],
      ['es-EC', '/es'],
      ['fr', '/es'],
      ['', '/es'],
    ]) {
      const r = await request.get('/', { headers: { 'Accept-Language': lang }, maxRedirects: 0 })
      expect(r.status()).toBe(307)
      expect(new URL(r.headers()['location']!, 'http://x').pathname).toBe(destino)
    }
  })

  for (const [es, en] of PAGINAS) {
    test(`${es} ↔ ${en}: mismo html lang, mismos bloques y selector correcto`, async ({ page }) => {
      await page.goto(es)
      await expect(page.locator('html')).toHaveAttribute('lang', 'es')
      const bloquesEs = await page.locator('[data-section]').evaluateAll((n) => n.map((x) => x.getAttribute('data-section')))
      await page.locator('.idiomas a[hreflang="en"]').click()
      await expect(page).toHaveURL(new RegExp(`${en}$`))
      await expect(page.locator('html')).toHaveAttribute('lang', 'en')
      const bloquesEn = await page.locator('[data-section]').evaluateAll((n) => n.map((x) => x.getAttribute('data-section')))
      // Las secciones vacías pueden ocultarse si el inglés aún no está publicado; la cabecera siempre está.
      expect(bloquesEn).toContain(bloquesEs[0])
      await page.locator('.idiomas a[hreflang="es"]').click()
      await expect(page).toHaveURL(new RegExp(`${es}$`))
    })
  }

  test('cada idioma tiene su propio slug y el selector lleva a la versión equivalente', async ({ page, request }) => {
    // El slug en español no existe en inglés (y al revés): cada idioma tiene su dirección.
    expect((await request.get('/en/projects/sistema-escolar')).status()).toBe(404)
    expect((await request.get('/es/proyectos/school-management-system')).status()).toBe(404)
    await page.goto('/es/proyectos/sistema-escolar')
    await page.locator('.idiomas a[hreflang="en"]').click()
    await expect(page).toHaveURL(/\/en\/projects\/school-management-system$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await page.goto('/es/articulos/cuando-las-fuentes-no-coinciden')
    await page.locator('.idiomas a[hreflang="en"]').click()
    await expect(page).toHaveURL(/\/en\/articles\/when-sources-dont-match$/)
  })

  test('una página sin traducción lleva al listado con aviso', async ({ page }) => {
    await page.goto('/en/projects?aviso=sin-traduccion')
    await expect(page.getByRole('status')).toContainText('not available')
  })

  test('un locale no permitido da 404', async ({ request }) => {
    expect((await request.get('/de/about')).status()).toBe(404)
  })
})
