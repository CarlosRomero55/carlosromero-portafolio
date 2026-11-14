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

/** srcSet: versiones más pequeñas para pantallas angostas (celular). */
export type ImagenPublica = { url: string; alt: string; ancho: number | null; alto: number | null; srcSet?: string }
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
export type Area = 'analisis' | 'ingenieria' | 'ambos' | 'web'
export type Cifra = { cifra: string; texto: string }
export type ProyectoTarjeta = {
  id: string
  titulo: string
  slug: string
  area: Area
  resumen: string
  tecnologias: string[]
  destacado: boolean
  portada: ImagenPublica | null
  portadaEtiqueta: string | null
  destacados: Cifra[]
  repositorio: string | null
  demo: string | null
}
export type Captura = ImagenPublica & { titulo: string | null; leyenda: string | null }
export type ProyectoDetalle = ProyectoTarjeta & {
  preguntaNegocio: string
  problema: RichText
  datosLimpieza: RichText
  metodo: RichText
  resultado: RichText
  aprendizajes: RichText
  graficos: { archivo: string; titulo: string }[]
  capturas: Captura[]
  titular: string | null
  hallazgos: (Cifra & { tono: 'normal' | 'destacado' | 'riesgo' })[]
  ficha: { tipo: string | null; periodo: string | null; fuentesDatos: string | null; calidad: string | null }
  pasos: { etiqueta: string; titulo: string; texto: string | null; color: 'ninguno' | 'bronze' | 'silver' | 'gold' }[]
  decisiones: { titulo: string; texto: string }[]
  simulador: 'ninguno' | 'china-2024'
  enlaces: { texto: string; url: string }[]
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
export type ServicioPublico = {
  id: string
  nombre: string
  descripcion: string
  herramientas: string[]
  grupo: 'datos' | 'sistemas'
  icono: 'grafico' | 'base' | 'rayo' | 'pantalla' | 'caja'
  dolor: string | null
  entregables: string[]
  estado: 'disponible' | 'proximamente'
  ejemplo: { titulo: string; slug: string } | null
  demoUrl: string | null
}
export type ArticuloTarjeta = {
  id: string
  titulo: string
  slug: string
  fecha: string
  resumen: string
  etiquetas: string[]
  portada: ImagenPublica | null
}
export type ArticuloDetalle = ArticuloTarjeta & {
  contenido: RichText
  proyecto: { titulo: string; slug: string } | null
  seoTitulo: string | null
  seoDescripcion: string | null
}
export type IdiomaPublico = { id: string; idioma: string; nivel: string }

const str = (v: unknown): string => (typeof v === 'string' ? v : '')
const strN = (v: unknown): string | null => (typeof v === 'string' && v.trim() ? v : null)
const rich = (v: unknown): RichText =>
  v && typeof v === 'object' && 'root' in (v as Rec) ? { root: (v as { root: Rec }).root } : null
const lista = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [])
const id = (v: unknown): string => String(v)
const filas = (v: unknown): Rec[] => (Array.isArray(v) ? (v as Rec[]) : [])
const https = (v: unknown): string | null => (typeof v === 'string' && /^https:\/\/[^\s]+$/.test(v) ? v : null)
const RUTA_ESTATICA = /^\/proyectos\/[a-z0-9-]+\/[a-z0-9_-]+\.(webp|png|jpg)$/

/** Imagen subida (Media) o, si no hay, ruta estática del sitio validada. */
function imagenORuta(subida: unknown, ruta: unknown, alt: unknown, locale: Locale): ImagenPublica | null {
  const m = imagen(subida, locale)
  if (m) return m
  if (typeof ruta === 'string' && RUTA_ESTATICA.test(ruta)) {
    // Cada .webp de public/proyectos tiene su versión `-800.webp` (pnpm imagenes; lo comprueba una prueba unitaria).
    const srcSet = ruta.endsWith('.webp') ? `${ruta.replace(/\.webp$/, '-800.webp')} 800w, ${ruta} 1600w` : undefined
    return { url: ruta, alt: str(alt), ancho: null, alto: null, srcSet }
  }
  return null
}

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
    srcSet: srcSetSubida(m),
  }
}

/** Usa los tamaños que Payload genera al subir (sm 400, md 600, lg 1200) más el original. */
function srcSetSubida(m: Rec): string | undefined {
  const tamanos = (m.sizes ?? {}) as Record<string, Rec>
  const partes = Object.values(tamanos)
    .filter((t) => t && typeof t.url === 'string' && typeof t.width === 'number')
    .map((t) => `${t.url} ${t.width}w`)
  if (partes.length === 0) return undefined
  if (typeof m.width === 'number') partes.push(`${m.url} ${m.width}w`)
  return partes.join(', ')
}

const publicado: Where = { publicado: { equals: true } }

async function payload() {
  return getPayload({ config })
}

function cacheado<A extends unknown[], R>(nombre: string, fn: (...a: A) => Promise<R>) {
  const conCache = unstable_cache(fn, [nombre], { tags: [TAG_CONTENIDO], revalidate: 3600 })
  // Ningún valor que no sea 'es' o 'en' llega nunca a la base de datos.
  return (...args: A): Promise<R> => {
    const locale = nombre.startsWith('slug-alterno') ? args[1] : args[0]
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

function tarjeta(d: Rec, locale: Locale): ProyectoTarjeta {
  const area: Area = d.area === 'analisis' || d.area === 'ingenieria' || d.area === 'web' ? d.area : 'ambos'
  return {
    id: id(d.id),
    titulo: str(d.titulo),
    slug: str(d.slug),
    area,
    resumen: str(d.resumen),
    tecnologias: lista(d.tecnologias),
    destacado: d.destacado === true,
    portada: imagenORuta(d.portada, d.portadaRuta, d.portadaAlt, locale),
    portadaEtiqueta: strN(d.portadaEtiqueta),
    destacados: filas(d.destacados)
      .map((f) => ({ cifra: str(f.cifra), texto: str(f.texto) }))
      .filter((f) => f.cifra && f.texto),
    repositorio: strN(d.repositorio),
    demo: https(d.demo),
  }
}

export const getProyectos = cacheado('proyectos', async (locale: Locale): Promise<ProyectoTarjeta[]> => {
  return (await buscar('proyectos', locale, publicado, 1)).map((d) => tarjeta(d, locale))
})

export const getProyecto = cacheado(
  'proyecto',
  async (locale: Locale, slug: string): Promise<ProyectoDetalle | null> => {
    const docs = await buscar('proyectos', locale, { and: [publicado, { slug: { equals: slug } }] }, 1)
    const d = docs[0]
    if (!d) return null
    const seo = (d.seo ?? {}) as Rec
    return {
      ...tarjeta(d, locale),
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
      capturas: filas(d.capturas)
        .map((c) => {
          const img = imagenORuta(c.imagen, c.ruta, c.alt, locale)
          return img ? { ...img, titulo: strN(c.titulo), leyenda: strN(c.leyenda) } : null
        })
        .filter((x): x is Captura => x !== null),
      titular: strN(d.titular),
      hallazgos: filas(d.hallazgos)
        .map((f) => ({
          cifra: str(f.cifra),
          texto: str(f.texto),
          tono: (f.tono === 'destacado' || f.tono === 'riesgo' ? f.tono : 'normal') as 'normal' | 'destacado' | 'riesgo',
        }))
        .filter((f) => f.cifra && f.texto),
      ficha: (() => {
        const f = (d.ficha ?? {}) as Rec
        return { tipo: strN(f.tipo), periodo: strN(f.periodo), fuentesDatos: strN(f.fuentesDatos), calidad: strN(f.calidad) }
      })(),
      pasos: filas(d.pasos)
        .map((f) => ({
          etiqueta: str(f.etiqueta),
          titulo: str(f.titulo),
          texto: strN(f.texto),
          color: (['bronze', 'silver', 'gold'].includes(str(f.color)) ? f.color : 'ninguno') as
            | 'ninguno'
            | 'bronze'
            | 'silver'
            | 'gold',
        }))
        .filter((f) => f.etiqueta && f.titulo),
      decisiones: filas(d.decisiones)
        .map((f) => ({ titulo: str(f.titulo), texto: str(f.texto) }))
        .filter((f) => f.titulo && f.texto),
      simulador: d.simulador === 'china-2024' ? 'china-2024' : 'ninguno',
      enlaces: filas(d.enlaces)
        .map((f) => ({ texto: str(f.texto), url: https(f.url) ?? '' }))
        .filter((f) => f.texto && f.url),
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
  (await buscar('servicios', locale, publicado, 1)).map((d) => {
    const ej = d.proyectoEjemplo && typeof d.proyectoEjemplo === 'object' ? (d.proyectoEjemplo as Rec) : null
    const iconos = ['grafico', 'base', 'rayo', 'pantalla', 'caja'] as const
    return {
      id: id(d.id),
      nombre: str(d.nombre),
      descripcion: str(d.descripcion),
      herramientas: lista(d.herramientas),
      grupo: d.grupo === 'sistemas' ? 'sistemas' : 'datos',
      icono: (iconos as readonly string[]).includes(str(d.icono)) ? (d.icono as ServicioPublico['icono']) : 'grafico',
      dolor: strN(d.dolor),
      entregables: filas(d.entregables).map((f) => str(f.texto)).filter(Boolean),
      estado: d.estado === 'proximamente' ? 'proximamente' : 'disponible',
      // Solo se enlaza un proyecto que esté publicado en este idioma.
      ejemplo: ej && ej.publicado === true && str(ej.slug) ? { titulo: str(ej.titulo), slug: str(ej.slug) } : null,
      demoUrl: https(d.demoUrl),
    }
  }),
)

export const getIdiomas = cacheado('idiomas', async (locale: Locale): Promise<IdiomaPublico[]> =>
  (await buscar('idiomas', locale)).map((d) => ({ id: id(d.id), idioma: str(d.idioma), nivel: str(d.nivel) })),
)

function articuloTarjeta(d: Rec, locale: Locale): ArticuloTarjeta {
  return {
    id: id(d.id),
    titulo: str(d.titulo),
    slug: str(d.slug),
    fecha: str(d.fecha),
    resumen: str(d.resumen),
    etiquetas: lista(d.etiquetas),
    portada: imagenORuta(d.portada, d.portadaRuta, d.portadaAlt, locale),
  }
}

async function buscarArticulos(locale: Locale, where: Where) {
  const p = await payload()
  const res = await p.find({
    collection: 'articulos',
    locale,
    fallbackLocale: false,
    where,
    depth: 1,
    limit: 100,
    sort: '-fecha',
    pagination: false,
  })
  return res.docs as unknown as Rec[]
}

export const getArticulos = cacheado('articulos', async (locale: Locale): Promise<ArticuloTarjeta[]> =>
  (await buscarArticulos(locale, publicado)).map((d) => articuloTarjeta(d, locale)),
)

export const getArticulo = cacheado(
  'articulo',
  async (locale: Locale, slug: string): Promise<ArticuloDetalle | null> => {
    const d = (await buscarArticulos(locale, { and: [publicado, { slug: { equals: slug } }] }))[0]
    if (!d) return null
    const pr = d.proyecto && typeof d.proyecto === 'object' ? (d.proyecto as Rec) : null
    const seo = (d.seo ?? {}) as Rec
    return {
      ...articuloTarjeta(d, locale),
      contenido: rich(d.contenido),
      proyecto: pr && pr.publicado === true && str(pr.slug) ? { titulo: str(pr.titulo), slug: str(pr.slug) } : null,
      seoTitulo: strN(seo.titulo),
      seoDescripcion: strN(seo.descripcion),
    }
  },
)

export const getSlugAlternoArticulo = cacheado(
  'slug-alterno-articulo',
  async (idArticulo: string, otro: Locale): Promise<string | null> => {
    const docs = await buscarArticulos(otro, { and: [publicado, { id: { equals: idArticulo } }] })
    return docs[0] ? strN(docs[0].slug) : null
  },
)
