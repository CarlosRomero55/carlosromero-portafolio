import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'
import { conSesion, nadie } from '../access'

const MIN_CLAVE = 12

export const Usuarios: CollectionConfig = {
  slug: 'usuarios',
  labels: { singular: 'Usuario', plural: 'Usuarios' },
  admin: { useAsTitle: 'email', group: 'Sistema' },
  access: {
    read: conSesion,
    create: conSesion,
    update: conSesion,
    delete: conSesion,
  },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000, // 15 min
    tokenExpiration: 60 * 60 * 2, // 2 h
    cookies: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    },
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        const clave = (data as { password?: string }).password
        if (typeof clave === 'string' && clave.length < MIN_CLAVE) {
          throw new APIError(`La contraseña debe tener al menos ${MIN_CLAVE} caracteres.`, 400, undefined, true)
        }
        return data
      },
    ],
    afterLogin: [
      async ({ req, user }) => {
        // Registro de accesos: solo id de usuario, fecha y resultado. Sin IP.
        await req.payload.create({
          collection: 'registroAccesos',
          data: { usuario: user.id, resultado: 'ok' },
          overrideAccess: true,
          req,
        })
      },
    ],
  },
  fields: [],
}

export const RegistroAccesos: CollectionConfig = {
  slug: 'registroAccesos',
  labels: { singular: 'Acceso al panel', plural: 'Registro de accesos' },
  admin: { group: 'Sistema', defaultColumns: ['usuario', 'resultado', 'createdAt'] },
  access: { read: conSesion, create: nadie, update: nadie, delete: conSesion },
  fields: [
    { name: 'usuario', type: 'relationship', relationTo: 'usuarios' },
    { name: 'resultado', type: 'select', options: ['ok'], defaultValue: 'ok' },
  ],
}
