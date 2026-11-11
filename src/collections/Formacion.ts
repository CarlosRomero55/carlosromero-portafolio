import type { CollectionConfig } from 'payload'
import { accesoAdmin, campoInterno } from '../access'
import { campoOrden, campoPublicado } from '../fields/publicacion'
import { hooksPublicos } from '../hooks/revalidar'

const verificacion = {
  name: 'verificacionInterna',
  type: 'text' as const,
  label: '🔒 Enlace de verificación (nunca público)',
  access: { read: campoInterno, update: campoInterno, create: campoInterno },
  admin: { description: 'Solo visible en el panel. No aparece en el sitio, el CV ni la API.' },
}

export const Formacion: CollectionConfig = {
  slug: 'formacion',
  labels: { singular: 'Formación', plural: 'Formación' },
  admin: { useAsTitle: 'nombre', group: 'Contenido' },
  access: accesoAdmin,
  hooks: hooksPublicos,
  defaultSort: 'orden',
  fields: [
    campoPublicado(['nombre']),
    campoOrden,
    {
      name: 'tipo',
      type: 'select',
      required: true,
      options: [
        { label: 'Título', value: 'titulo' },
        { label: 'Bootcamp / programa', value: 'bootcamp' },
      ],
    },
    { name: 'nombre', type: 'text', localized: true },
    { name: 'institucion', type: 'text', required: true, label: 'Institución' },
    { name: 'anio', type: 'text', label: 'Año' },
    { name: 'detalle', type: 'text', localized: true },
    { name: 'nombreEnCredencial', type: 'text', label: 'Nombre que figura en la credencial' },
    verificacion,
  ],
}

export const Certificaciones: CollectionConfig = {
  slug: 'certificaciones',
  labels: { singular: 'Certificación', plural: 'Certificaciones' },
  admin: { useAsTitle: 'nombre', group: 'Contenido', defaultColumns: ['nombre', 'estado', 'orden'] },
  access: accesoAdmin,
  hooks: hooksPublicos,
  defaultSort: 'orden',
  fields: [
    campoPublicado([]),
    campoOrden,
    { name: 'nombre', type: 'text', required: true, label: 'Nombre oficial (no se traduce)' },
    { name: 'emisor', type: 'text', required: true },
    { name: 'plataforma', type: 'text' },
    { name: 'anio', type: 'text', label: 'Año' },
    {
      name: 'estado',
      type: 'select',
      required: true,
      defaultValue: 'en_preparacion',
      options: [
        { label: 'Obtenida', value: 'obtenida' },
        { label: 'En preparación', value: 'en_preparacion' },
      ],
    },
    verificacion,
  ],
}
