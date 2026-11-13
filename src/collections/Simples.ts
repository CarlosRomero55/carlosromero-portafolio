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
    {
      name: 'grupo',
      type: 'select',
      required: true,
      defaultValue: 'datos',
      options: [
        { label: 'Datos', value: 'datos' },
        { label: 'Sistemas para negocios', value: 'sistemas' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'icono',
      type: 'select',
      defaultValue: 'grafico',
      options: [
        { label: 'Gráfico', value: 'grafico' },
        { label: 'Base de datos', value: 'base' },
        { label: 'Rayo (automatización)', value: 'rayo' },
        { label: 'Pantalla (sistema web)', value: 'pantalla' },
        { label: 'Caja (inventario)', value: 'caja' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'dolor',
      type: 'text',
      localized: true,
      maxLength: 90,
      label: 'Frase del cliente (entre comillas)',
      admin: { description: 'Ej.: Me entero de cómo va el negocio a fin de mes.' },
    },
    {
      name: 'entregables',
      type: 'array',
      label: 'Qué entrego',
      maxRows: 4,
      fields: [{ name: 'texto', type: 'text', localized: true, required: true }],
    },
    {
      name: 'estado',
      type: 'select',
      defaultValue: 'disponible',
      options: [
        { label: 'Con ejemplo publicado', value: 'disponible' },
        { label: 'Próximamente', value: 'proximamente' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'proyectoEjemplo', type: 'relationship', relationTo: 'proyectos', label: 'Proyecto de ejemplo' },
    {
      name: 'demoUrl',
      type: 'text',
      label: 'Enlace a demo (si el ejemplo es una demo)',
      validate: (v: string | null | undefined) => !v || /^https:\/\/[^\s]+$/.test(v) || 'Debe empezar con https://',
    },
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
