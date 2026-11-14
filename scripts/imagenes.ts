/**
 * Genera la versión de 800 px (`nombre-800.webp`) de cada captura en public/proyectos,
 * para que en el celular se descargue la imagen pequeña. Uso: pnpm imagenes
 */
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const raiz = path.resolve('public/proyectos')
for (const dir of fs.readdirSync(raiz)) {
  for (const f of fs.readdirSync(path.join(raiz, dir))) {
    if (!f.endsWith('.webp') || f.endsWith('-800.webp')) continue
    const destino = path.join(raiz, dir, f.replace(/\.webp$/, '-800.webp'))
    if (fs.existsSync(destino)) continue
    await sharp(path.join(raiz, dir, f)).resize({ width: 800 }).webp({ quality: 80 }).toFile(destino)
    console.log('Creada', path.relative('public', destino))
  }
}
