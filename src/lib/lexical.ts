/** Deja solo enlaces http(s) y mailto en el texto enriquecido antes de mostrarlo. */
type Nodo = { type?: string; fields?: { url?: string; linkType?: string; newTab?: boolean }; children?: Nodo[] }

const SEGURO = /^(https?:\/\/|mailto:)/i

function limpiar(n: Nodo): Nodo {
  const copia: Nodo = { ...n }
  if ((n.type === 'link' || n.type === 'autolink') && n.fields) {
    const url = n.fields.url ?? ''
    if (n.fields.linkType === 'internal' || !SEGURO.test(url.trim())) {
      // Convierte el enlace en texto plano conservando sus hijos.
      return { type: 'paragraph-inline', children: (n.children ?? []).map(limpiar) } as Nodo
    }
  }
  if (n.type === 'upload' || n.type === 'relationship' || n.type === 'block' || n.type === 'inlineBlock') {
    return { type: 'text', text: '' } as unknown as Nodo
  }
  if (n.children) copia.children = n.children.map(limpiar)
  return copia
}

export function sanear<T>(data: T): T {
  if (!data || typeof data !== 'object' || !('root' in data)) return data
  const root = (data as unknown as { root: Nodo }).root
  return { root: limpiar(root) } as unknown as T
}
