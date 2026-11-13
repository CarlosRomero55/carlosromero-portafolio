import { expect, test } from '@playwright/test'

test.describe('proyectos, casos y catálogo', () => {
  test('el simulador recalcula el impacto al mover el precio', async ({ page }) => {
    await page.goto('/es/proyectos/shrimp-intelligence-ecuador')
    const impacto = page.locator('[data-impacto]')
    await expect(impacto).toHaveText('−314 M') // −10 % por defecto, igual que el dashboard
    const precio = page.getByLabel('Precio que paga China')
    await precio.fill('-20')
    await expect(impacto).toHaveText('−627 M')
    await precio.fill('0')
    await expect(impacto).toHaveText('0 M')
  })

  test('la página del caso tiene resumen, proceso, hallazgos y ficha técnica', async ({ page }) => {
    await page.goto('/es/proyectos/shrimp-intelligence-ecuador')
    await expect(page.locator('h1')).toContainText('China compra la mitad')
    for (const s of ['resumen', 'contexto', 'que-hice', 'que-encontre', 'simulador', 'decisiones']) {
      await expect(page.locator(`[data-section="${s}"]`)).toHaveCount(1)
    }
    await expect(page.getByRole('complementary', { name: 'Ficha técnica' })).toContainText('104 meses')
    await expect(page.locator('figcaption', { hasText: 'DATOS SIMULADOS de una finca ficticia' })).toBeVisible()
  })

  test('los filtros de proyectos separan datos y sistemas web', async ({ page }) => {
    await page.goto('/es/proyectos?tipo=web')
    await expect(page.locator('[data-proyecto]')).toHaveCount(2)
    await expect(page.locator('[data-proyecto="sistema-escolar"]')).toBeVisible()
    await expect(page.locator('[data-proyecto="inventario-punto-de-venta"]')).toBeVisible()
    await page.goto('/es/proyectos?tipo=datos')
    await expect(page.locator('[data-proyecto="shrimp-intelligence-ecuador"]')).toBeVisible()
    await expect(page.locator('[data-proyecto="sistema-escolar"]')).toHaveCount(0)
    await page.goto('/es/proyectos?tipo=<script>')
    await expect(page.locator('[data-proyecto]')).toHaveCount(3)
  })

  test('toda la tarjeta lleva al caso y el enlace de demo abre aparte', async ({ page }) => {
    test.skip(test.info().project.name !== 'escritorio')
    await page.goto('/es/proyectos')
    const tarjeta = page.locator('[data-proyecto="sistema-escolar"]')
    await expect(tarjeta.getByRole('link', { name: /Probar demo/ })).toHaveAttribute('href', 'https://escuela-demo.onrender.com')
    // Clic en la imagen de la tarjeta (no en el título): la tarjeta entera es clicable.
    await tarjeta.click({ position: { x: 40, y: 40 } })
    await expect(page).toHaveURL(/\/es\/proyectos\/sistema-escolar$/)
  })

  test('el catálogo agrupa servicios y marca los que están en preparación', async ({ page }) => {
    await page.goto('/es/servicios')
    await expect(page.locator('[data-grupo="datos"] [data-servicio]')).toHaveCount(3)
    await expect(page.locator('[data-grupo="sistemas"] [data-servicio]')).toHaveCount(2)
    await expect(page.getByText('PRÓXIMAMENTE')).toHaveCount(1)
    await expect(page.locator('[data-grupo="sistemas"]').getByRole('link', { name: /Probar demo/ })).toHaveCount(2)
  })

  test('el caso trae vista previa para compartir (og:image)', async ({ request }) => {
    const html = await (await request.get('/es/proyectos/shrimp-intelligence-ecuador')).text()
    expect(html).toMatch(/<meta property="og:image" content="[^"]*\/proyectos\/shrimp\/01_resumen\.webp"/)
  })
})
