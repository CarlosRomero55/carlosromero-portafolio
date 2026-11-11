import type { ServicioPublico } from '@/lib/data/public'

export function TarjetasServicios({ servicios }: { servicios: ServicioPublico[] }) {
  return (
    <ul className="rejilla">
      {servicios.map((s, i) => (
        <li className="tarjeta" key={s.id}>
          <span className="tarjeta__num" aria-hidden="true">
            {String(i + 1).padStart(2, '0')}
          </span>
          <h3>{s.nombre}</h3>
          <p>{s.descripcion}</p>
          {s.herramientas.length > 0 && (
            <ul className="etiquetas">
              {s.herramientas.map((h) => (
                <li className="etiqueta" key={h}>
                  {h}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  )
}
