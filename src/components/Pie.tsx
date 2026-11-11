import { getTranslations } from 'next-intl/server'
import { getPerfil } from '@/lib/data/public'
import type { Locale } from '@/i18n/routing'
import { ruta } from '@/lib/rutas'

export async function Pie({ locale }: { locale: Locale }) {
  const [t, tn, perfil] = await Promise.all([
    getTranslations({ locale, namespace: 'pie' }),
    getTranslations({ locale, namespace: 'nav' }),
    getPerfil(locale),
  ])
  return (
    <footer className="pie">
      <div className="contenedor pie__fila">
        <p style={{ margin: 0 }}>
          {t('derechos', { anio: new Date().getFullYear() })}
          {perfil.ubicacion ? ` · ${perfil.ubicacion}` : ''}
        </p>
        <ul>
          {perfil.linkedin && (
            <li>
              <a href={perfil.linkedin} rel="me noopener noreferrer" target="_blank">
                LinkedIn
              </a>
            </li>
          )}
          {perfil.github && (
            <li>
              <a href={perfil.github} rel="me noopener noreferrer" target="_blank">
                GitHub
              </a>
            </li>
          )}
          <li>
            <a href={ruta(locale, '/contact')}>{tn('contacto')}</a>
          </li>
          <li>
            <a href={ruta(locale, '/privacy')}>{t('privacidad')}</a>
          </li>
        </ul>
      </div>
    </footer>
  )
}
