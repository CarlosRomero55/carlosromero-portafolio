import { getLocale, getTranslations } from 'next-intl/server'

export default async function NoEncontrado() {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'error' })
  return (
    <main id="contenido" className="contenedor cabecera-pagina">
      <p className="sobretitulo">404</p>
      <h1>{t('noEncontrado')}</h1>
      <p>
        <a className="enlace-flecha" href={`/${locale}`}>
          ← {t('volver')}
        </a>
      </p>
    </main>
  )
}
