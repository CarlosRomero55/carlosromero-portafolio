import type { CollectionConfig } from 'payload'
import { conSesion, nadie } from '../access'

/** Todo 🔒. Se crea solo desde la acción de servidor (Local API). */
export const Mensajes: CollectionConfig = {
  slug: 'mensajes',
  labels: { singular: 'Mensaje', plural: 'Mensajes de contacto' },
  admin: {
    useAsTitle: 'correo',
    group: 'Bandeja',
    defaultColumns: ['nombre', 'apellido', 'area', 'atendido', 'createdAt'],
  },
  access: { read: conSesion, create: nadie, update: conSesion, delete: conSesion },
  fields: [
    { name: 'nombre', type: 'text', required: true, maxLength: 60 },
    { name: 'apellido', type: 'text', required: true, maxLength: 60 },
    { name: 'correo', type: 'email', required: true },
    { name: 'codigoPais', type: 'text' },
    { name: 'telefono', type: 'text' },
    { name: 'area', type: 'text', required: true },
    { name: 'mensaje', type: 'textarea', required: true, maxLength: 2000 },
    { name: 'idiomaEnvio', type: 'select', options: ['es', 'en'] },
    { name: 'atendido', type: 'checkbox', defaultValue: false },
  ],
}

/** Técnica: HMAC(IP + sal diaria). Nunca la IP en claro. */
export const RateLimit: CollectionConfig = {
  slug: 'rateLimit',
  admin: { hidden: true },
  access: { read: nadie, create: nadie, update: nadie, delete: nadie },
  fields: [
    { name: 'clave', type: 'text', required: true, index: true },
    { name: 'ventana', type: 'text', required: true, index: true },
    { name: 'conteo', type: 'number', required: true, defaultValue: 0 },
  ],
}
