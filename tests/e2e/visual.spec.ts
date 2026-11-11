import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { TODAS } from './rutas'

test.describe('visual y accesibilidad', () => {
  for (const ruta of TODAS) {
    test(`${ruta}: sin violaciones graves de axe, sin scroll horizontal, sin errores de CSP`, async ({ page }) => {
      const violacionesCsp: string[] = []
      page.on('console', (m) => {
        if (m.type() === 'error' && /Content Security Policy|Refused to/i.test(m.text())) violacionesCsp.push(m.text())
      })
      await page.goto(ruta)
      await page.waitForLoadState('networkidle')
      const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
      const graves = axe.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious')
      expect(graves.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(' | ')}`)).toEqual([])
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
      expect(violacionesCsp.filter((t) => !/challenges\.cloudflare\.com/.test(t))).toEqual([])
      const imgs = await page.locator('img').evaluateAll((n) => n.filter((i) => !(i as HTMLImageElement).alt).length)
      expect(imgs).toBe(0)
    })
  }

  test('sin scroll horizontal de 320 a 1440 px (ES y EN)', async ({ page }) => {
    test.skip(test.info().project.name !== 'escritorio')
    for (const ruta of ['/es', '/en', '/es/proyectos/shrimp-intelligence-ecuador', '/es/contacto']) {
      await page.goto(ruta)
      for (let w = 320; w <= 1440; w += 40) {
        await page.setViewportSize({ width: w, height: 800 })
        const ok = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)
        expect(ok, `${ruta} @ ${w}px`).toBe(true)
      }
    }
  })

  test('el foco es visible y alcanza el selector de idioma con Tab', async ({ page }) => {
    test.skip(test.info().project.name !== 'escritorio')
    await page.goto('/es')
    await page.keyboard.press('Tab')
    await expect(page.locator('.saltar')).toBeFocused()
    let llego = false
    for (let i = 0; i < 12 && !llego; i++) {
      await page.keyboard.press('Tab')
      llego = await page.evaluate(() => document.activeElement?.getAttribute('hreflang') === 'en')
    }
    expect(llego).toBe(true)
    const contorno = await page.evaluate(() => getComputedStyle(document.activeElement!).outlineStyle)
    expect(contorno).not.toBe('none')
  })
})
