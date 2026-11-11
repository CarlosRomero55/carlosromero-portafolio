import 'server-only'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import { getPayload, type Where } from 'payload'
import { TAG_CONTENIDO } from '@/hooks/revalidar'
import { esLocale, type Locale } from '@/i18n/routing'

/**
 * D6: ÚNICA puerta de datos hacia las páginas públicas.
 * La Local API de Payload ignora el control de acceso, así que aquí cada función
 * devuelve un objeto nuevo con una LISTA BLANCA de campos. Nada de lo que no esté
 * escrito explícitamente abajo (verificacionInterna, notasInternas, mensajes,
 * usuarios…) puede llegar al HTML.
 */

type Rec = Record<string, unknown>
export type RichText = { root: Rec } | null

export type ImagenPublica = { url: string; alt: string; ancho: number | null; alto: number | null }
export type PerfilPublico = {
  nombrePublico: string
  nombreCompleto: string
  titular: string
  presentacion: string
  sobreMi: RichText
  ubicacion: string
  foto: ImagenPublica | null
  linkedin: string | null
  github: string | null
  disponible: boolean
  seoTitulo: string | null
  seoDescripcion: string | null
}
export type ProyectoTarjeta = {
  id: string
  titulo: string
  slug: string
  area: 'analisis' | 'ingenieria' | 'ambos'
  resumen: string
  tecnologias: string[]
}
export type ProyectoDetalle = ProyectoTarjeta & {
  preguntaNegocio: string
  problema: RichText
  datosLimpieza: RichText
  metodo: RichText
  resultado: RichText
  aprendizajes: RichText
  graficos: { archivo: string; titulo: string }[]
  capturas: ImagenPublica[]
  contieneDatosSimulados: boolean
  fuentes: { nombre: string; url: string; fechaConsulta: string }[]
  repositorio: string | null
  seoTitulo: string | null
  seoDescripcion: string | null
}
export type EtapaPublica = {
  id: string
  cargo: string
  organizacion: string
  periodo: string | null
  descripcion: string | null
  breve: boolean
  hijas: EtapaPublica[]
}
export type FormacionPublica = {
  id: string
  tipo: string
  nombre: string
  institucion: string
  anio: string | null
  detalle: string | null
  nombreEnCredencial: string | null
}
export type CertificacionPublica = {
  id: string
  nombre: string
  emisor: string
  plataforma: string | null
  anio: string | null
  estado: 'obtenida' | 'en_preparacion'
}
export type ServicioPublico = { id: string; nombre: string; descripcion: string; herramientas: string[] }
export type IdiomaPublico = { id: string; idioma: string; nivel: string }

const str = (v: unknown): string => (typeof v === 'string' ? v : '')
const strN = (v: unknown): string | null => (typeof v === 'string' && v.trim() ? v : null)
const rich = (v: unknown): RichText =>
  v && typeof v === 'object' && 'root' in (v as Rec) ? { root: (v as { root: Rec }).root } : null
const lista = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [])
const id = (v: unknown): string => String(v)

function imagen(v: unknown, locale: Locale): ImagenPublica | null {
  if (!v || typeof v !== 'object') return null
  const m = v as Rec
  const url = str(m.url)
  if (!url) return null
  return {
    url,
    alt: typeof m.alt === 'string' ? m.alt : typeof m.alt === 'object' && m.alt ? str((m.alt as Rec)[locale]) : '',
    ancho: typeof m.width === 'number' ? m.width : null,
    alto: typeof m.height === 'number' ? m.height : null,
  }
}

const publicado: Where = { publicado: { equals: true } }

async function payload() {
  return getPayload({ config })
}

function cacheado<A extends unknown[], R>(nombre: string, fn: (...a: A) => Promise<R>) {
  const conCache = unstable_cache(fn, [nombre], { tags: [TAG_CONTENIDO], revalidate: 3600 })
  // Ningún valor que no sea 'es' o 'en' llega nunca a la base de datos.
  return (...args: A): Promise<R> => {
    const locale = nombre === 'slug-alterno' ? args[1] : args[0]
    if (!esLocale(locale)) notFound()
    return conCache(...args)
  }
}

async function buscar(collection: string, locale: Locale, where: Where = publicado, depth = 0) {
  const p = await payload()
  const res = await p.find({
    collection: collection as 'proyectos',
    locale,
    fallbackLocale: false,
    where,
    depth,
    limit: 100,
    sort: 'orden',
    pagination: false,
  })
  return res.docs as unknown as Rec[]
}

export const getPerfil = cacheado('perfil', async (locale: Locale): Promise<PerfilPublico> => {
  const p = await payload()
  const d = (await p.findGlobal({ slug: 'perfil', locale, fallbackLocale: false, depth: 1 })) as unknown as Rec
  const seo = (d.seo ?? {}) as Rec
  return {
    nombrePublico: str(d.nombrePublico) || 'Carlos Romero',
    nombreCompleto: str(d.nombreCompleto),
    titular: str(d.titular),
    presentacion: str(d.presentacion),
    sobreMi: rich(d.sobreMi),
    ubicacion: str(d.ubicacion),
    foto: imagen(d.foto, locale),
    linkedin: strN(d.linkedin),
    github: strN(d.github),
    disponible: d.disponible === true,
    seoTitulo: strN(seo.titulo),
    seoDescripcion: strN(seo.descripcion),
  }
})

export const getTextos = cacheado('textos', async (locale: Locale) => {
  const p = await payload()
  const d = (await p.findGlobal({ slug: 'textosSitio', locale, fallbackLocale: false })) as unknown as Rec
  return { avisoPrivacidad: rich(d.avisoPrivacidad), pie: strN(d.pie), actualizado: str(d.updatedAt) }
})

function tarjeta(d: Rec): ProyectoTarjeta {
  const area = d.area === 'analisis' || d.area === 'ingenieria' ? d.area : 'ambos'
  return {
    id: id(d.id),
    titulo: str(d.titulo),
    slug: str(d.slug),
    area,
    resumen: str(d.resumen),
    tecnologias: lista(d.tecnologias),
  }
}

export const getProyectos = cacheado('proyectos', async (locale: Locale): Promise<ProyectoTarjeta[]> => {
  return (await buscar('proyectos', locale)).map(tarjeta)
})

export const getProyecto = cacheado(
  'proyecto',
  async (locale: Locale, slug: string): Promise<ProyectoDetalle | null> => {
    const docs = await buscar('proyectos', locale, { and: [publicado, { slug: { equals: slug } }] }, 1)
    const d = docs[0]
    if (!d) return null
    const seo = (d.seo ?? {}) as Rec
    return {
      ...tarjeta(d),
      preguntaNegocio: str(d.preguntaNegocio),
      problema: rich(d.problema),
      datosLimpieza: rich(d.datosLimpieza),
      metodo: rich(d.metodo),
      resultado: rich(d.resultado),
      aprendizajes: rich(d.aprendizajes),
      graficos: (Array.isArray(d.graficos) ? (d.graficos as Rec[]) : []).map((g) => ({
        archivo: str(g.archivo),
        titulo: str(g.titulo),
      })),
      capturas: (Array.isArray(d.capturas) ? (d.capturas as Rec[]) : [])
        .map((c) => imagen(c.imagen, locale))
        .filter((x): x is ImagenPublica => x !== null),
      contieneDatosSimulados: d.contieneDatosSimulados === true,
      fuentes: (Array.isArray(d.fuentes) ? (d.fuentes as Rec[]) : [])
        .map((f) => ({ nombre: str(f.nombre), url: str(f.url), fechaConsulta: str(f.fechaConsulta) }))
        .filter((f) => /^https:\/\//.test(f.url)),
      repositorio: strN(d.repositorio),
      seoTitulo: strN(seo.titulo),
      seoDescripcion: strN(seo.descripcion),
    }
  },
)

/** Slug del mismo proyecto en el otro idioma (para el selector y hreflang). null si no está publicado allí. */
export const getSlugAlterno = cacheado(
  'slug-alterno',
  async (idProyecto: string, otro: Locale): Promise<string | null> => {
    const docs = await buscar('proyectos', otro, { and: [publicado, { id: { equals: idProyecto } }] })
    return docs[0] ? strN(docs[0].slug) : null
  },
)

export const getTrayectoria = cacheado('trayectoria', async (locale: Locale): Promise<EtapaPublica[]> => {
  const docs = await buscar('trayectoria', locale)
  const etapa = (d: Rec): EtapaPublica => ({
    id: id(d.id),
    cargo: str(d.cargo),
    organizacion: str(d.organizacion),
    periodo: strN(d.periodo),
    descripcion: strN(d.descripcion),
    breve: d.breve === true,
    hijas: [],
  })
  const padreDe = (d: Rec) => (d.etapaPadre == null ? null : id(typeof d.etapaPadre === 'object' ? (d.etapaPadre as Rec).id : d.etapaPadre))
  const raiz = docs.filter((d) => padreDe(d) === null).map(etapa)
  for (const d of docs) {
    const padre = padreDe(d)
    if (padre) raiz.find((r) => r.id === padre)?.hijas.push(etapa(d))
  }
  return raiz
})

export const getFormacion = cacheado('formacion', async (locale: Locale): Promise<FormacionPublica[]> =>
  (await buscar('formacion', locale)).map((d) => ({
    id: id(d.id),
    tipo: str(d.tipo),
    nombre: str(d.nombre),
    institucion: str(d.institucion),
    anio: strN(d.anio),
    detalle: strN(d.detalle),
    nombreEnCredencial: strN(d.nombreEnCredencial),
  })),
)

export const getCertificaciones = cacheado('certificaciones', async (locale: Locale): Promise<CertificacionPublica[]> =>
  (await buscar('certificaciones', locale)).map((d) => ({
    id: id(d.id),
    nombre: str(d.nombre),
    emisor: str(d.emisor),
    plataforma: strN(d.plataforma),
    anio: strN(d.anio),
    estado: d.estado === 'obtenida' ? 'obtenida' : 'en_preparacion',
  })),
)

export const getServicios = cacheado('servicios', async (locale: Locale): Promise<ServicioPublico[]> =>
  (await buscar('servicios', locale)).map((d) => ({
    id: id(d.id),
    nombre: str(d.nombre),
    descripcion: str(d.descripcion),
    herramientas: lista(d.herramientas),
  })),
)

export const getIdiomas = cacheado('idiomas', async (locale: Locale): Promise<IdiomaPublico[]> =>
  (await buscar('idiomas', locale)).map((d) => ({ id: id(d.id), idioma: str(d.idioma), nivel: str(d.nivel) })),
)
