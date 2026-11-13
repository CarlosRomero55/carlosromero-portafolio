import { expect, test } from '@playwright/test'

test.describe('artículos (fase 6)', () => {
  test('el listado muestra el artículo y el menú incluye Artículos', async ({ page }) => {
    await page.goto('/es/articulos')
    await expect(page.locator('[data-articulo="cuando-las-fuentes-no-coinciden"]')).toBeVisible()
    // En móvil el menú está plegado; se comprueba que el enlace exista en el encabezado.
    await expect(page.locator('header a.nav__enlace[href="/es/articulos"]').first()).toHaveText('Artículos')
  })

  test('el detalle tiene fecha, contenido y enlace al proyecto relacionado', async ({ page }) => {
    await page.goto('/es/articulos/cuando-las-fuentes-no-coinciden')
    await expect(page.locator('h1')).toContainText('tres fuentes oficiales')
    await expect(page.locator('time').first()).toHaveAttribute('datetime', /2026-11-13/)
    await expect(page.locator('[data-section="relacionado"] a')).toHaveAttribute('href', '/es/proyectos/shrimp-intelligence-ecuador')
  })

  test('el sitemap incluye artículos en ambos idiomas', async ({ request }) => {
    const xml = await (await request.get('/sitemap.xml')).text()
    expect(xml).toContain('/es/articulos/cuando-las-fuentes-no-coinciden')
    expect(xml).toContain('/en/articles/when-sources-dont-match')
  })

  test('la analítica está apagada por defecto (no carga script de Vercel)', async ({ page }) => {
    const scripts: string[] = []
    page.on('request', (r) => {
      if (r.resourceType() === 'script') scripts.push(r.url())
    })
    await page.goto('/es')
    await page.waitForLoadState('load')
    expect(scripts.filter((u) => u.includes('_vercel/insights'))).toEqual([])
  })
})
