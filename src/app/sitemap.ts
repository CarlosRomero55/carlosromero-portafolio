import type { MetadataRoute } from 'next'
import { routing, type RutaInterna } from '@/i18n/routing'
import { getArticulos, getProyectos } from '@/lib/data/public'
import { ruta, rutaArticulo, rutaProyecto, urlAbsoluta } from '@/lib/rutas'

export const dynamic = 'force-dynamic'

const ESTATICAS: RutaInterna[] = ['/', '/about', '/services', '/projects', '/articles', '/contact', '/privacy']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entradas: MetadataRoute.Sitemap = []
  for (const l of routing.locales) {
    const proyectos = await getProyectos(l)
    const articulos = await getArticulos(l)
    for (const href of ESTATICAS) {
      // La lista de artículos vacía no aporta a Google: solo entra si hay alguno publicado en ese idioma.
      if (href === '/articles' && articulos.length === 0) continue
      entradas.push({
        url: urlAbsoluta(ruta(l, href)),
        alternates: { languages: Object.fromEntries(routing.locales.map((o) => [o, urlAbsoluta(ruta(o, href))])) },
      })
    }
    for (const p of proyectos) entradas.push({ url: urlAbsoluta(rutaProyecto(l, p.slug)) })
    for (const a of articulos) entradas.push({ url: urlAbsoluta(rutaArticulo(l, a.slug)), lastModified: a.fecha })
  }
  return entradas
}
