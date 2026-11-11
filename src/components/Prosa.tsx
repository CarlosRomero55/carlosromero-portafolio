import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import type { RichText as RT } from '@/lib/data/public'
import { sanear } from '@/lib/lexical'

const convertidores: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  // Nodo interno que produce el saneador para enlaces no permitidos.
  'paragraph-inline': ({ node, nodesToJSX }) => <>{nodesToJSX({ nodes: (node as { children: [] }).children })}</>,
})

/** D-Salida: convertidor oficial de Lexical (sin dangerouslySetInnerHTML). */
export function Prosa({ data, className = 'prosa' }: { data: RT; className?: string }) {
  if (!data) return null
  return (
    <RichText
      className={className}
      converters={convertidores}
      data={sanear(data) as unknown as SerializedEditorState}
      disableContainer={false}
    />
  )
}
