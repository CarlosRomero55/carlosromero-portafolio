'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Parte interactiva de la historia: detecta qué paso está en el centro de la pantalla
 * y muestra su gráfico en el panel fijo. Sin JS, el panel no aparece (cada paso trae su gráfico).
 */
export function Scrolly({ total, fijos, children }: { total: number; fijos: ReactNode[]; children: ReactNode }) {
  const [activo, setActivo] = useState(0)
  const [listo, setListo] = useState(false)
  const raiz = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = raiz.current
    if (!el || !('IntersectionObserver' in window)) return
    setListo(true)
    const pasos = Array.from(el.querySelectorAll<HTMLElement>('[data-paso]'))
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) setActivo(Number(e.target.getAttribute('data-paso')))
        }
      },
      // Cuenta como activo el paso que cruza la franja central de la pantalla.
      { rootMargin: '-45% 0px -45% 0px' },
    )
    pasos.forEach((p) => obs.observe(p))
    return () => obs.disconnect()
  }, [total])

  return (
    <div ref={raiz} className={listo ? 'hp-scrolly hp-scrolly--activo' : 'hp-scrolly'}>
      <div className="hp-fijo" aria-hidden="true">
        {fijos.map((g, i) => (
          <div key={i} className={i === activo ? 'hp-fijo__g hp-fijo__g--visible' : 'hp-fijo__g'}>
            {g}
          </div>
        ))}
        <p className="hp-fijo__num">
          {String(activo + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </p>
      </div>
      <div className="hp-pasos">{children}</div>
    </div>
  )
}
