'use client'

import Script from 'next/script'
import { useActionState, useEffect, useRef, useState } from 'react'
import { enviarContacto } from '@/lib/contact/accion'
import { AREAS, PAISES, type EstadoFormulario } from '@/lib/contact/schema'

const MAX = 2000

/** Textos del namespace "contacto", aplanados en el servidor (sin librería de i18n en el navegador). */
export type TextosContacto = Record<string, string>

export function FormularioContacto({
  locale,
  siteKey,
  nonce,
  rutaPrivacidad,
  textos,
}: {
  locale: 'es' | 'en'
  siteKey: string
  nonce?: string
  rutaPrivacidad: string
  textos: TextosContacto
}) {
  const t = (clave: string, vars?: Record<string, string | number>) =>
    (textos[clave] ?? clave).replace(/\{(\w+)\}/g, (_, k: string) => String(vars?.[k] ?? ''))
  const [estado, accion, enviando] = useActionState<EstadoFormulario, FormData>(enviarContacto, { estado: 'inicial' })
  const [largo, setLargo] = useState(0)
  const [pais, setPais] = useState('EC')
  const formRef = useRef<HTMLFormElement>(null)
  const estadoRef = useRef<HTMLParagraphElement>(null)
  const campos = estado.estado === 'error' ? (estado.campos ?? {}) : {}

  useEffect(() => {
    if (estado.estado === 'ok') {
      formRef.current?.reset()
      setLargo(0)
    }
    if (estado.estado !== 'inicial') {
      estadoRef.current?.focus()
      // Turnstile da un token de un solo uso: se renueva tras cada intento.
      ;(window as unknown as { turnstile?: { reset: () => void } }).turnstile?.reset()
    }
  }, [estado])

  const err = (k: keyof typeof campos) =>
    campos[k] ? (
      <p className="campo__error" id={`e-${k}`}>
        {t(`errores.${campos[k]}`)}
      </p>
    ) : null
  const aria = (k: keyof typeof campos) =>
    campos[k] ? { 'aria-invalid': true as const, 'aria-describedby': `e-${k}` } : {}

  const paises = Object.entries(PAISES).sort(([a, x], [b, y]) =>
    a === 'EC' ? -1 : b === 'EC' ? 1 : a === 'OT' ? 1 : b === 'OT' ? -1 : x[locale].localeCompare(y[locale], locale),
  )

  return (
    <form ref={formRef} action={accion} className="formulario" noValidate>
      {estado.estado !== 'inicial' && (
        <p
          ref={estadoRef}
          tabIndex={-1}
          role={estado.estado === 'ok' ? 'status' : 'alert'}
          className={`estado-envio ${estado.estado === 'ok' ? 'estado-envio--ok' : 'estado-envio--error'}`}
        >
          {estado.estado === 'ok'
            ? t('exito')
            : estado.motivo === 'limite'
              ? t('limite')
              : estado.motivo === 'verificacion'
                ? t('verificacion')
                : t('error')}
        </p>
      )}

      <input type="hidden" name="idioma" value={locale} />
      <div className="trampa" aria-hidden="true">
        <label htmlFor="sitio_web">No llenar</label>
        <input id="sitio_web" name="sitio_web" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="campo">
        <label htmlFor="nombre">
          {t('nombre')} <span className="opcional">({t('obligatorio')})</span>
        </label>
        <input id="nombre" name="nombre" required maxLength={60} autoComplete="given-name" {...aria('nombre')} />
        {err('nombre')}
      </div>
      <div className="campo">
        <label htmlFor="apellido">
          {t('apellido')} <span className="opcional">({t('obligatorio')})</span>
        </label>
        <input id="apellido" name="apellido" required maxLength={60} autoComplete="family-name" {...aria('apellido')} />
        {err('apellido')}
      </div>
      <div className="campo campo--ancho">
        <label htmlFor="correo">
          {t('correo')} <span className="opcional">({t('obligatorio')})</span>
        </label>
        <input id="correo" name="correo" type="email" required maxLength={254} autoComplete="email" inputMode="email" {...aria('correo')} />
        {err('correo')}
      </div>
      <div className="campo">
        <label htmlFor="pais">
          {t('pais')} <span className="opcional">({t('obligatorio')})</span>
        </label>
        <select id="pais" name="pais" required value={pais} onChange={(e) => setPais(e.target.value)} autoComplete="country" {...aria('pais')}>
          {paises.map(([codigo, p]) => (
            <option key={codigo} value={codigo}>
              {p[locale]} {p.prefijo && `(${p.prefijo})`}
            </option>
          ))}
        </select>
        {err('pais')}
      </div>
      <div className="campo">
        <label htmlFor="telefono">{t('telefono')}</label>
        <input
          id="telefono"
          name="telefono"
          type="tel"
          inputMode="tel"
          maxLength={20}
          autoComplete="tel-national"
          aria-describedby={campos.telefono ? 'e-telefono' : 'a-telefono'}
          aria-invalid={campos.telefono ? true : undefined}
        />
        {campos.telefono ? (
          err('telefono')
        ) : (
          <p className="campo__ayuda" id="a-telefono">
            {PAISES[pais]?.prefijo || '—'}
          </p>
        )}
      </div>
      <div className="campo campo--ancho">
        <label htmlFor="area">
          {t('area')} <span className="opcional">({t('obligatorio')})</span>
        </label>
        <select id="area" name="area" required defaultValue="" {...aria('area')}>
          <option value="" disabled>
            {t('elige')}
          </option>
          {AREAS.map((a) => (
            <option key={a} value={a}>
              {t(`areas.${a}`)}
            </option>
          ))}
        </select>
        {err('area')}
      </div>
      <div className="campo campo--ancho">
        <label htmlFor="mensaje">
          {t('mensaje')} <span className="opcional">({t('obligatorio')})</span>
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          required
          maxLength={MAX}
          onChange={(e) => setLargo(e.target.value.length)}
          aria-describedby={campos.mensaje ? 'e-mensaje a-mensaje' : 'a-mensaje'}
          aria-invalid={campos.mensaje ? true : undefined}
        />
        {err('mensaje')}
        <p className="campo__ayuda" id="a-mensaje" aria-live="polite">
          {t('caracteres', { n: largo, max: MAX })}
        </p>
      </div>

      <div className="campo--ancho">
        <div className="cf-turnstile" data-sitekey={siteKey} data-language={locale} data-theme="light" />
      </div>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" nonce={nonce} async defer />

      <div className="form-pie">
        <p>
          {t('privacidad')} <a href={rutaPrivacidad}>{t('avisoPrivacidad')}</a>.
        </p>
        <button className="boton boton--primario" type="submit" disabled={enviando}>
          {enviando ? t('enviando') : t('enviar')}
        </button>
      </div>
    </form>
  )
}
