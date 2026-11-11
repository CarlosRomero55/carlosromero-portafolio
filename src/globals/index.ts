import type { GlobalConfig } from 'payload'
import { conSesion } from '../access'
import { revalidarGlobal } from '../hooks/revalidar'

const urlPermitida = (dominio: RegExp) => (v: string | null | undefined) =>
  !v || dominio.test(v) || 'Dirección no permitida para este campo.'

export const Perfil: GlobalConfig = {
  slug: 'perfil',
  label: 'Perfil',
  admin: { group: 'Contenido' },
  access: { read: conSesion, update: conSesion },
  hooks: { afterChange: [revalidarGlobal] },
  fields: [
    { name: 'nombrePublico', type: 'text', required: true, defaultValue: 'Carlos Romero' },
    { name: 'nombreCompleto', type: 'text', defaultValue: 'Carlos Eduardo Romero Huerta' },
    { name: 'titular', type: 'text', localized: true, label: 'Titular' },
    { name: 'presentacion', type: 'textarea', localized: true, label: 'Presentación (primera persona)' },
    { name: 'sobreMi', type: 'richText', localized: true, label: 'Texto de "Sobre mí"' },
    { name: 'ubicacion', type: 'text', localized: true, label: 'Ubicación' },
    { name: 'foto', type: 'upload', relationTo: 'media' },
    {
      name: 'linkedin',
      type: 'text',
      validate: urlPermitida(/^https:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+\/?$/),
    },
    { name: 'github', type: 'text', validate: urlPermitida(/^https:\/\/github\.com\/[A-Za-z0-9_-]+\/?$/) },
    {
      name: 'disponible',
      type: 'checkbox',
      defaultValue: true,
      label: 'Mostrar "Disponible para proyectos"',
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'titulo', type: 'text', localized: true },
        { name: 'descripcion', type: 'textarea', localized: true, maxLength: 160 },
      ],
    },
  ],
}

export const TextosSitio: GlobalConfig = {
  slug: 'textosSitio',
  label: 'Textos del sitio',
  admin: { group: 'Contenido' },
  access: { read: conSesion, update: conSesion },
  hooks: { afterChange: [revalidarGlobal] },
  fields: [
    { name: 'avisoPrivacidad', type: 'richText', localized: true, label: 'Aviso de privacidad' },
    { name: 'pie', type: 'text', localized: true, label: 'Texto del pie de página' },
  ],
}
