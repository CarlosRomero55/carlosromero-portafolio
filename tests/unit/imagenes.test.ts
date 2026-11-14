import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

describe('capturas estáticas', () => {
  it('cada .webp de public/proyectos tiene su versión -800.webp (pnpm imagenes)', () => {
    const raiz = path.resolve('public/proyectos')
    const faltan: string[] = []
    for (const dir of fs.readdirSync(raiz)) {
      for (const f of fs.readdirSync(path.join(raiz, dir))) {
        if (!f.endsWith('.webp') || f.endsWith('-800.webp')) continue
        if (!fs.existsSync(path.join(raiz, dir, f.replace(/\.webp$/, '-800.webp')))) faltan.push(`${dir}/${f}`)
      }
    }
    expect(faltan).toEqual([])
  })
})
