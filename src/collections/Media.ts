import type { CollectionConfig } from 'payload'
import { accesoAdmin } from '../access'
import { hooksPublicos } from '../hooks/revalidar'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Imagen', plural: 'Imágenes' },
  admin: { group: 'Contenido' },
  access: accesoAdmin,
  hooks: hooksPublicos,
  upload: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    imageSizes: [
      { name: 'sm', width: 400, formatOptions: { format: 'webp' } },
      { name: 'md', width: 600, formatOptions: { format: 'webp' } },
      { name: 'lg', width: 1200, formatOptions: { format: 'webp' } },
    ],
    // Quita metadatos EXIF (ubicación, cámara) al procesar con sharp.
    withMetadata: false,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
      label: { es: 'Texto alternativo', en: 'Alt text' },
    },
    { name: 'credito', type: 'text', label: 'Crédito (opcional)' },
  ],
}
