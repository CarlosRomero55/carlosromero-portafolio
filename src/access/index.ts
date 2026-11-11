import type { Access, FieldAccess } from 'payload'

/** D5: todo lo que pasa por REST/GraphQL exige sesión. */
export const conSesion: Access = ({ req }) => Boolean(req.user)

/** Nadie desde la API. Solo la Local API del servidor (overrideAccess) puede hacerlo. */
export const nadie: Access = () => false

/** Campo interno: solo un usuario con sesión lo lee o lo cambia. */
export const campoInterno: FieldAccess = ({ req }) => Boolean(req.user)

export const accesoAdmin = {
  read: conSesion,
  create: conSesion,
  update: conSesion,
  delete: conSesion,
}
