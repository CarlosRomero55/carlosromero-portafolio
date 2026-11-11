/** Ayudante mínimo para escribir texto enriquecido de Lexical desde el seed. */
type Nodo = Record<string, unknown>

const texto = (t: string, bold = false): Nodo => ({
  type: 'text',
  text: t,
  format: bold ? 1 : 0,
  detail: 0,
  mode: 'normal',
  style: '',
  version: 1,
})

const bloque = (type: string, children: Nodo[], extra: Nodo = {}): Nodo => ({
  type,
  children,
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
  ...extra,
})

export const p = (t: string) => bloque('paragraph', [texto(t)], { textFormat: 0, textStyle: '' })
export const h3 = (t: string) => bloque('heading', [texto(t)], { tag: 'h3' })
export const ul = (items: string[]) =>
  bloque(
    'list',
    items.map((t, i) => bloque('listitem', [texto(t)], { value: i + 1 })),
    { listType: 'bullet', start: 1, tag: 'ul' },
  )

export function doc(...nodos: Nodo[]) {
  return { root: bloque('root', nodos) }
}
