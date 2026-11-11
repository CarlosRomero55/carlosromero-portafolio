import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

export const TAG_CONTENIDO = 'contenido-publico'

async function invalidar() {
  try {
    const { revalidateTag } = await import('next/cache')
    revalidateTag(TAG_CONTENIDO, { expire: 0 })
  } catch {
    // Fuera de Next (seed, scripts) no hay caché que invalidar.
  }
}

export const revalidarColeccion: CollectionAfterChangeHook = async ({ doc }) => {
  await invalidar()
  return doc
}

export const revalidarBorrado: CollectionAfterDeleteHook = async ({ doc }) => {
  await invalidar()
  return doc
}

export const revalidarGlobal: GlobalAfterChangeHook = async ({ doc }) => {
  await invalidar()
  return doc
}

export const hooksPublicos = {
  afterChange: [revalidarColeccion],
  afterDelete: [revalidarBorrado],
}
