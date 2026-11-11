import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { FormularioContacto } from '@/components/FormularioContacto'
import { Pagina } from '@/components/Pagina'
import type { Locale } from '@/i18n/routing'
import { metadatos } from '@/lib/metadatos'
import { alternasDe, ruta } from '@/lib/rutas'

type P = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contacto' })
  return metadatos({
    locale,
    titulo: t('titulo'),
    descripcion: t('intro'),
    alternas: alternasDe('/contact'),
    propia: ruta(locale, '/contact'),
  })
}

export default async function Contacto({ params }: P) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'contacto' })
  const nonce = (await headers()).get('x-nonce') ?? undefined
  const mensajes = (await getMessages({ locale })) as { contacto: Record<string, unknown> }
  const aplanar = (o: Record<string, unknown>, pre = ''): Record<string, string> =>
    Object.fromEntries(
      Object.entries(o).flatMap(([k, v]) =>
        typeof v === 'object' && v ? Object.entries(aplanar(v as Record<string, unknown>, `${pre}${k}.`)) : [[`${pre}${k}`, String(v)]],
      ),
    )
  return (
    <Pagina locale={locale} actual="/contact" alternas={alternasDe('/contact')}>
      <header className="contenedor cabecera-pagina" data-section="cabecera">
        <h1>{t('titulo')}</h1>
        <p className="lead">{t('intro')}</p>
      </header>
      <section className="contenedor" data-section="formulario" style={{ maxWidth: '50rem', paddingBottom: 'var(--space-6)' }}>
        <FormularioContacto
          locale={locale}
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
          nonce={nonce}
          rutaPrivacidad={ruta(locale, '/privacy')}
          textos={aplanar(mensajes.contacto)}
        />
      </section>
    </Pagina>
  )
}
