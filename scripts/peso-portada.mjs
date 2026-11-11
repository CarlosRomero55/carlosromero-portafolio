// Suma el JS que descarga la portada (gzip) y falla si supera 150 KB.
import { gzipSync } from 'node:zlib'
const BASE = process.env.BASE_URL || 'http://localhost:3000'
const html = await (await fetch(`${BASE}/es`)).text()
// Los scripts noModule (polyfills) no los descargan los navegadores modernos.
const srcs = [...html.matchAll(/<script([^>]+)>/g)]
  .filter((m) => !/noModule/i.test(m[1]))
  .map((m) => /src="([^"]+)"/.exec(m[1])?.[1])
  .filter(Boolean)
let total = 0
for (const s of new Set(srcs)) total += gzipSync(Buffer.from(await (await fetch(new URL(s, BASE))).arrayBuffer())).length
const kb = (total / 1024).toFixed(1)
console.log(`JS inicial de la portada: ${kb} KB comprimido (${srcs.length} archivos)`)
if (total > 150 * 1024) process.exit(1)
