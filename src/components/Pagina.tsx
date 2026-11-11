import type { ReactNode } from 'react'
import type { Locale, RutaInterna } from '@/i18n/routing'
import type { Alternas } from '@/lib/rutas'
import { Encabezado } from './Encabezado'
import { Pie } from './Pie'

/** Estructura común: encabezado (con selector que conoce la página equivalente), contenido y pie. */
export function Pagina({
  locale,
  actual,
  alternas,
  children,
}: {
  locale: Locale
  actual: RutaInterna
  alternas: Alternas
  children: ReactNode
}) {
  return (
    <>
      <Encabezado locale={locale} actual={actual} alternas={alternas} />
      <main id="contenido" tabIndex={-1}>
        {children}
      </main>
      <Pie locale={locale} />
    </>
  )
}
