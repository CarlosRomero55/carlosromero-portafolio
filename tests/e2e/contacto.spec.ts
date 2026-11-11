import { expect, test } from '@playwright/test'

test.describe('formulario', () => {
  test('todos los campos tienen etiqueta y el envío vacío muestra errores', async ({ page }) => {
    test.skip(test.info().project.name !== 'escritorio')
    await page.goto('/es/contacto')
    for (const id of ['nombre', 'apellido', 'correo', 'pais', 'telefono', 'area', 'mensaje']) {
      await expect(page.locator(`label[for="${id}"]`)).toHaveCount(1)
    }
    // El campo trampa no es alcanzable con teclado.
    await expect(page.locator('#sitio_web')).toHaveAttribute('tabindex', '-1')
  })

  // Necesita salida a challenges.cloudflare.com (en CI sí la hay).
  test('envío válido (Turnstile en modo prueba) muestra confirmación', async ({ page }) => {
    test.skip(test.info().project.name !== 'escritorio' || !process.env.E2E_CONTACTO, 'solo con E2E_CONTACTO=1')
    await page.goto('/en/contact')
    await page.fill('#nombre', 'Prueba')
    await page.fill('#apellido', 'Automática')
    await page.fill('#correo', 'prueba@example.com')
    await page.selectOption('#area', 'otro')
    await page.fill('#mensaje', 'Mensaje de prueba automática.')
    await page.waitForFunction(() => {
      const i = document.querySelector('input[name="cf-turnstile-response"]') as HTMLInputElement | null
      return !!i?.value
    }, undefined, { timeout: 20_000 })
    await page.click('button[type="submit"]')
    await expect(page.getByRole('status')).toContainText('Thank you')
  })
})
