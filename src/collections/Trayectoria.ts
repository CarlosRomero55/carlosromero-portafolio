import type { CollectionConfig } from 'payload'
import { accesoAdmin } from '../access'
import { campoOrden, campoPublicado } from '../fields/publicacion'
import { hooksPublicos } from '../hooks/revalidar'

export const Trayectoria: CollectionConfig = {
  slug: 'trayectoria',
  labels: { singular: 'Etapa de trayectoria', plural: 'Trayectoria' },
  admin: { useAsTitle: 'cargo', group: 'Contenido', defaultColumns: ['cargo', 'organizacion', 'periodo', 'orden'] },
  access: accesoAdmin,
  hooks: hooksPublicos,
  defaultSort: 'orden',
  fields: [
    campoPublicado(['cargo', 'organizacion']),
    campoOrden,
    { name: 'cargo', type: 'text', localized: true },
    { name: 'organizacion', type: 'text', localized: true, label: 'Organización' },
    {
      name: 'periodo',
      type: 'text',
      localized: true,
      label: 'Periodo',
      admin: { description: 'Texto libre: "2025 – actualidad", "2018 – 2020". Vacío si no se muestra.' },
    },
    { name: 'descripcion', type: 'textarea', localized: true, label: 'Descripción (hechos concretos)' },
    {
      name: 'etapaPadre',
      type: 'relationship',
      relationTo: 'trayectoria',
      label: 'Pertenece a la etapa',
      admin: { description: 'Ej.: el contrato con Cervecería Nacional pertenece a la etapa Freelance.' },
    },
    {
      name: 'breve',
      type: 'checkbox',
      defaultValue: false,
      label: 'Mostrar en una línea breve',
    },
  ],
}
