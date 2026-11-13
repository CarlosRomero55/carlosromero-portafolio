# carlosromero-portafolio

Portafolio bilingüe (español `/es` · inglés `/en`) de **Carlos Romero**, analista e ingeniero de datos en Guayaquil, Ecuador.

**Stack:** Next.js 16 · Payload CMS 3 (embebido) · PostgreSQL en Neon · Vercel Blob · next-intl · Resend · Cloudflare Turnstile.

## Qué incluye

- Seis páginas por idioma con rutas traducidas (`/es/sobre-mi` ↔ `/en/about`) y selector que lleva a la misma página.
- Panel en `/admin` con 2FA (TOTP) para editar proyectos, trayectoria, formación, certificaciones, servicios, idiomas, perfil y textos.
- Cada pieza se publica **por idioma**: solo se puede marcar "Publicado en este idioma" si sus campos obligatorios están completos.
- Formulario de contacto con Turnstile, campo trampa, validación en servidor y límite de 5 envíos por día por conexión (hash de IP, nunca la IP en claro).
- CV en PDF (`/es/cv.pdf`, `/en/cv.pdf`) generado desde los mismos datos del panel.
- Sin API pública: REST de Payload exige sesión y GraphQL está desactivado. Las páginas leen los datos por una capa con lista blanca de campos (`src/lib/data/public.ts`).
- CSP con nonce, HSTS y cabeceras de seguridad; sin cookies ni analítica en el sitio público.

## Desarrollo local

Requisitos: Node 22+, pnpm 10, PostgreSQL 16.

```bash
cp .env.example .env        # y completa DATABASE_URL, PAYLOAD_SECRET, RATE_LIMIT_SECRET
pnpm install
pnpm migrate                # crea el esquema
pnpm seed                   # contenido inicial (ES publicado, EN en borrador)
pnpm dev                    # http://localhost:3000
```

Si cambias colecciones o campos: `pnpm migrate:create nombre` y luego `pnpm migrate`.
(`migrate:create` activa a propósito el almacén Blob con un token ficticio, para que el esquema incluya sus columnas igual que en producción.)

## Pruebas

```bash
pnpm test:unit              # validación del formulario, límite, claves de idioma, saneador
pnpm build && pnpm start    # en otra terminal:
pnpm test:e2e               # idiomas, accesibilidad (axe), CSP, cabeceras, API sin sesión, móvil
pnpm test:scan              # busca datos internos, correos o teléfonos en todo lo público
node scripts/peso-portada.mjs   # JS inicial de la portada < 150 KB
```

GitHub Actions corre todo esto (más gitleaks y `pnpm audit`) en cada pull request.

## Datos simulados

Los gráficos usan `data/synthetic/*.json`, generados con semilla fija (`pnpm data:synthetic`) y siempre marcados como **SIMULADOS** en la página.

## Despliegue

Ver [`docs/DESPLIEGUE.md`](docs/DESPLIEGUE.md).

---

© Carlos Romero. Todos los derechos reservados.
