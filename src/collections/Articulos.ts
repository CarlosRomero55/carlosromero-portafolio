import type { CollectionConfig } from 'payload'
import { accesoAdmin, campoInterno } from '../access'
import { campoOrden, campoPublicado } from '../fields/publicacion'
import { hooksPublicos } from '../hooks/revalidar'

const SLUG_VALIDO = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** Fase 6: artículos (blog). Mismas reglas que los proyectos: se publican por idioma. */
export const Articulos: CollectionConfig = {
  slug: 'articulos',
  labels: { singular: 'Artículo', plural: 'Artículos' },
  admin: { useAsTitle: 'titulo', group: 'Contenido', defaultColumns: ['titulo', 'fecha', 'publicado'] },
  access: accesoAdmin,
  hooks: hooksPublicos,
  defaultSort: '-fecha',
  fields: [
    campoPublicado(['titulo', 'slug', 'resumen', 'contenido']),
    campoOrden,
    { name: 'titulo', type: 'text', localized: true, label: { es: 'Título', en: 'Title' } },
    {
      name: 'slug',
      type: 'text',
      localized: true,
      index: true,
      label: { es: 'Dirección (slug)', en: 'Slug' },
      validate: (v: string | null | undefined) =>
        !v || SLUG_VALIDO.test(v) || 'Solo a-z, 0-9 y guiones (sin tildes ni espacios).',
    },
    {
      name: 'fecha',
      type: 'date',
      required: true,
      label: 'Fecha de publicación',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
    },
    { name: 'resumen', type: 'textarea', localized: true, maxLength: 220, label: 'Resumen (listado y redes)' },
    {
      type: 'collapsible',
      label: 'Imagen principal',
      fields: [
        { name: 'portada', type: 'upload', relationTo: 'media', label: 'Subir imagen' },
        {
          name: 'portadaRuta',
          type: 'text',
          label: 'o ruta de imagen del sitio',
          validate: (v: string | null | undefined) =>
            !v || /^\/proyectos\/[a-z0-9-]+\/[a-z0-9_-]+\.(webp|png|jpg)$/.test(v) || 'Ej.: /proyectos/shrimp/01_resumen.webp',
        },
        { name: 'portadaAlt', type: 'text', localized: true, label: 'Texto alternativo (para la ruta)' },
      ],
    },
    { name: 'contenido', type: 'richText', localized: true },
    { name: 'etiquetas', type: 'text', hasMany: true, admin: { description: 'Ej.: Power BI, Python' } },
    { name: 'proyecto', type: 'relationship', relationTo: 'proyectos', label: 'Proyecto relacionado' },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'titulo', type: 'text', localized: true },
        { name: 'descripcion', type: 'textarea', localized: true, maxLength: 160 },
      ],
    },
    {
      name: 'notasInternas',
      type: 'textarea',
      label: '🔒 Notas internas (nunca públicas)',
      access: { read: campoInterno, update: campoInterno, create: campoInterno },
    },
  ],
}
