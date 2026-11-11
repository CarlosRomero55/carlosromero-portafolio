import { renderToBuffer } from '@react-pdf/renderer'
import { unstable_cache } from 'next/cache'
import { getTranslations } from 'next-intl/server'
import { TAG_CONTENIDO } from '@/hooks/revalidar'
import { esLocale, type Locale } from '@/i18n/routing'
import { DocumentoCV } from '@/lib/cv/documento'
import {
  getCertificaciones,
  getFormacion,
  getIdiomas,
  getPerfil,
  getProyectos,
  getTrayectoria,
} from '@/lib/data/public'
import { ruta, urlAbsoluta } from '@/lib/rutas'

/**
 * D11: el PDF se genera con @react-pdf/renderer desde los mismos datos del panel.
 * Queda en caché y se regenera automáticamente cuando se guarda el Perfil o cualquier contenido.
 */
const generar = unstable_cache(
  async (locale: Locale): Promise<string> => {
    const t = await getTranslations({ locale, namespace: 'cv' })
    const [perfil, trayectoria, formacion, certificaciones, idiomas, proyectos] = await Promise.all([
      getPerfil(locale),
      getTrayectoria(locale),
      getFormacion(locale),
      getCertificaciones(locale),
      getIdiomas(locale),
      getProyectos(locale),
    ])
    const buffer = await renderToBuffer(
      <DocumentoCV
        locale={locale}
        textos={{
          perfil: t('perfil'),
          experiencia: t('experiencia'),
          formacion: t('formacion'),
          certificaciones: t('certificaciones'),
          idiomas: t('idiomas'),
          proyectos: t('proyectos'),
          enPreparacion: t('enPreparacion'),
        }}
        perfil={perfil}
        trayectoria={trayectoria}
        formacion={formacion}
        certificaciones={certificaciones}
        idiomas={idiomas}
        proyectos={proyectos}
        urlSitio={urlAbsoluta(ruta(locale, '/'))}
      />,
    )
    return Buffer.from(buffer).toString('base64')
  },
  ['cv-pdf'],
  { tags: [TAG_CONTENIDO], revalidate: 86400 },
)

export async function GET(_req: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!esLocale(locale)) return new Response('Not found', { status: 404 })
  const pdf = Buffer.from(await generar(locale), 'base64')
  const nombre = locale === 'es' ? 'CV-Carlos-Romero-ES.pdf' : 'CV-Carlos-Romero-EN.pdf'
  return new Response(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${nombre}"`,
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
