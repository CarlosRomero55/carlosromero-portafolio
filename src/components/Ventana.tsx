import type { ImagenPublica } from '@/lib/data/public'

/** Marco oscuro tipo ventana para que las capturas claras se integren al sitio. */
export function Ventana({
  imagen,
  titulo,
  prioridad = false,
}: {
  imagen: ImagenPublica
  titulo?: string | null
  prioridad?: boolean
}) {
  return (
    <div className="ventana">
      <div className="ventana__barra" aria-hidden="true">
        <i />
        <i />
        <i />
        {titulo && <span>{titulo}</span>}
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imagen.url}
        alt={imagen.alt}
        width={imagen.ancho ?? 1600}
        height={imagen.alto ?? 900}
        loading={prioridad ? 'eager' : 'lazy'}
        fetchPriority={prioridad ? 'high' : undefined}
        decoding="async"
      />
    </div>
  )
}
