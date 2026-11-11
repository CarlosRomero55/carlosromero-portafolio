import type { MetadataRoute } from 'next'
import { routing, type RutaInterna } from '@/i18n/routing'
import { getProyectos } from '@/lib/data/public'
import { ruta, rutaProyecto, urlAbsoluta } from '@/lib/rutas'

export const dynamic = 'force-dynamic'

const ESTATICAS: RutaInterna[] = ['/', '/about', '/services', '/projects', '/contact', '/privacy']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entradas: MetadataRoute.Sitemap = []
  for (const href of ESTATICAS) {
    entradas.push({
      url: urlAbsoluta(ruta('es', href)),
      alternates: { languages: Object.fromEntries(routing.locales.map((l) => [l, urlAbsoluta(ruta(l, href))])) },
    })
  }
  for (const l of routing.locales) {
    for (const p of await getProyectos(l)) entradas.push({ url: urlAbsoluta(rutaProyecto(l, p.slug)) })
  }
  return entradas
}
