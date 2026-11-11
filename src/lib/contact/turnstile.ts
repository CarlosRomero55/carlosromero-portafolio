import 'server-only'

const URL_VERIFICACION = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export async function verificarTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret || !token || token.length > 2048) return false
  try {
    const res = await fetch(URL_VERIFICACION, {
      method: 'POST',
      // No se envía la IP del visitante (dato opcional para Cloudflare).
      body: new URLSearchParams({ secret, response: token }),
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    })
    const data = (await res.json()) as { success?: boolean }
    return data.success === true
  } catch {
    return false
  }
}
