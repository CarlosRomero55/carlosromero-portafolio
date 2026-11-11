import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from './i18n/routing'

const intl = createMiddleware(routing)
const dev = process.env.NODE_ENV !== 'production'

/**
 * D8: CSP con nonce para el sitio público. Next aplica el nonce a sus propios
 * scripts cuando lo encuentra en la cabecera Content-Security-Policy de la petición.
 * Turnstile necesita challenges.cloudflare.com en script-src y frame-src.
 */
function cspPublica(nonce: string): string {
  return [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://challenges.cloudflare.com${dev ? " 'unsafe-eval'" : ''}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob: https://*.public.blob.vercel-storage.com`,
    `font-src 'self'`,
    `connect-src 'self' https://challenges.cloudflare.com${dev ? ' ws:' : ''}`,
    `frame-src https://challenges.cloudflare.com`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    dev ? '' : 'upgrade-insecure-requests',
  ]
    .filter(Boolean)
    .join('; ')
}

/** El panel de Payload necesita estilos y scripts en línea propios. Se aísla con su propia CSP. */
const CSP_ADMIN = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ''}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob: https://*.public.blob.vercel-storage.com`,
  `font-src 'self' data:`,
  `connect-src 'self'${dev ? ' ws:' : ''}`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `frame-ancestors 'none'`,
].join('; ')

/** Pasa cabeceras nuevas a la petición que verá el servidor (mecanismo de NextResponse.next({ request })). */
function anadirCabecerasPeticion(res: NextResponse, extra: Record<string, string>) {
  const existentes = res.headers.get('x-middleware-override-headers')
  const nombres = new Set(existentes ? existentes.split(',') : [])
  for (const [k, v] of Object.entries(extra)) {
    res.headers.set(`x-middleware-request-${k}`, v)
    nombres.add(k)
  }
  res.headers.set('x-middleware-override-headers', [...nombres].join(','))
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Panel y API de Payload: sin i18n; payload-totp necesita x-pathname.
  if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    const headers = new Headers(request.headers)
    headers.set('x-pathname', pathname)
    const res = NextResponse.next({ request: { headers } })
    res.headers.set('x-pathname', pathname)
    res.headers.set('Content-Security-Policy', CSP_ADMIN)
    res.headers.set('X-Robots-Tag', 'noindex, nofollow')
    return res
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const csp = cspPublica(nonce)
  const res = intl(request)
  res.headers.set('Content-Security-Policy', csp)
  // Sin cookies en el sitio público.
  res.headers.delete('set-cookie')
  if (!res.headers.get('location')) anadirCabecerasPeticion(res, { 'content-security-policy': csp, 'x-nonce': nonce })
  return res
}

export const config = {
  // Todo menos estáticos de Next y archivos con extensión (sitemap.xml, robots.txt, cv.pdf, imágenes).
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.[a-zA-Z0-9]{2,4}$).*)'],
}
