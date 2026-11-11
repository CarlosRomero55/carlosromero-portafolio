'use client'

import dynamic from 'next/dynamic'

// D12: Recharts se carga solo en la página de proyecto, nunca en la portada.
export const GraficoCliente = dynamic(() => import('./GraficoLinea'), {
  ssr: false,
  loading: () => <div className="grafico" />,
})
