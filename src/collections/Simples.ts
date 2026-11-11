import type { CollectionConfig } from 'payload'
import { accesoAdmin } from '../access'
import { campoOrden, campoPublicado } from '../fields/publicacion'
import { hooksPublicos } from '../hooks/revalidar'

export const Servicios: CollectionConfig = {
  slug: 'servicios',
  labels: { singular: 'Servicio', plural: 'Servicios' },
  admin: { useAsTitle: 'nombre', group: 'Contenido' },
  access: accesoAdmin,
  hooks: hooksPublicos,
  defaultSort: 'orden',
  fields: [
    campoPublicado(['nombre', 'descripcion']),
    campoOrden,
    { name: 'nombre', type: 'text', localized: true },
    { name: 'descripcion', type: 'textarea', localized: true, maxLength: 160 },
    { name: 'herramientas', type: 'text', hasMany: true, admin: { description: 'Ej.: Power BI, Python' } },
  ],
}

export const Idiomas: CollectionConfig = {
  slug: 'idiomas',
  labels: { singular: 'Idioma', plural: 'Idiomas' },
  admin: { useAsTitle: 'idioma', group: 'Contenido' },
  access: accesoAdmin,
  hooks: hooksPublicos,
  defaultSort: 'orden',
  fields: [
    campoPublicado(['idioma', 'nivel']),
    campoOrden,
    { name: 'idioma', type: 'text', localized: true },
    { name: 'nivel', type: 'text', localized: true },
  ],
}
