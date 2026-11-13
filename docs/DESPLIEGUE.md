# Guía de despliegue — para Carlos

Todo esto lo haces tú. **Nunca pegues claves ni contraseñas en el chat ni en el repositorio**: van solo en Vercel.
Tiempo estimado: 45–60 minutos. Todo en planes gratuitos.

Ten a mano una nota privada (fuera de GitHub) donde ir guardando los valores mientras los consigues.

---

## 1. Neon (base de datos)

1. Entra a https://neon.com y crea una cuenta (puedes usar tu GitHub).
2. **Create project** → nombre `carlosromero-portafolio`, región **AWS US East (N. Virginia)** (la más cercana a Vercel por defecto), Postgres 16 o superior.
3. En **Dashboard → Connect**, elige **Pooled connection** y copia la cadena que empieza con `postgresql://…`.
   → Ese valor es **`DATABASE_URL`**.
4. Revisa en **Settings → Plan** el límite de almacenamiento actual del plan gratuito (las páginas de Neon no coinciden entre 0,5 y 1 GB). Para este sitio sobra cualquiera de los dos.

## 2. Dos claves aleatorias

En tu computadora, abre una terminal y ejecuta dos veces:

```
openssl rand -hex 32
```

En **Windows**, abre **PowerShell** (menú Inicio → escribe "PowerShell") y pega esta línea completa:

```
$b = New-Object byte[] 32; [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b); ($b | % { $_.ToString('x2') }) -join ''
```

Cada vez que la ejecutes te da una clave nueva de 64 caracteres (números y letras de la a a la f). No uses generadores de páginas web: la clave debe nacer en tu computadora.

- El primer resultado es **`PAYLOAD_SECRET`**.
- El segundo es **`RATE_LIMIT_SECRET`**.

## 3. Resend (avisos de contacto a tu correo)

1. Entra a https://resend.com con **el mismo correo donde quieres recibir los avisos** (sin dominio propio, Resend solo envía al correo de la cuenta).
2. **API Keys → Create API Key** → nombre `portafolio`, permiso **Sending access**.
   → Ese valor es **`RESEND_API_KEY`** (solo se muestra una vez).
3. Tu correo de destino es **`CONTACT_NOTIFY_TO`**.
4. Deja `CONTACT_FROM` vacío por ahora. Cuando tengas dominio propio, lo verificas en Resend y lo cambias (por ejemplo `Portafolio <avisos@tudominio.com>`).

## 4. Cloudflare Turnstile (anti-bots del formulario)

1. Entra a https://dash.cloudflare.com y crea una cuenta.
2. Menú **Turnstile → Add widget**.
   - Nombre: `portafolio`
   - Hostnames: el dominio que te dé Vercel (ej. `carlosromero-portafolio.vercel.app`). Si luego compras dominio, lo agregas aquí.
   - Widget mode: **Managed**.
3. Copia:
   - **Site Key** → **`NEXT_PUBLIC_TURNSTILE_SITE_KEY`**
   - **Secret Key** → **`TURNSTILE_SECRET_KEY`**

## 5. Vercel (alojamiento)

1. Entra a https://vercel.com con tu GitHub (plan **Hobby**).
2. **Add New → Project** → importa `CarlosRomero55/carlosromero-portafolio`.
3. Framework: Next.js (lo detecta solo). **Build Command**: `pnpm run ci` (aplica las migraciones y construye).
4. Antes de pulsar **Deploy**, abre **Environment Variables** y agrega:

| Variable | Valor |
|---|---|
| `DATABASE_URL` | de Neon (paso 1) |
| `PAYLOAD_SECRET` | paso 2 |
| `RATE_LIMIT_SECRET` | paso 2 |
| `NEXT_PUBLIC_SITE_URL` | `https://carlosromero-portafolio.vercel.app` (o la que te asigne; sin barra al final) |
| `NEXT_PUBLIC_NOINDEX` | `true` mientras revisas; `false` cuando quieras aparecer en Google |
| `RESEND_API_KEY` | paso 3 |
| `CONTACT_NOTIFY_TO` | paso 3 |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | paso 4 |
| `TURNSTILE_SECRET_KEY` | paso 4 |

5. **Storage → Create → Blob** → conéctalo al proyecto. Vercel agrega solo **`BLOB_READ_WRITE_TOKEN`**.
6. **Deploy**. Si cambias una variable después, ve a **Deployments → ⋯ → Redeploy**.

## 6. Cargar el contenido inicial (una vez)

En tu computadora, dentro de la carpeta del proyecto:

1. Crea un archivo `.env` (está ignorado por git) con **solo** `DATABASE_URL` (la de Neon), `PAYLOAD_SECRET` y `RATE_LIMIT_SECRET`.
2. Ejecuta `pnpm install` y luego `pnpm seed`.
3. Borra el `.env` si no vas a trabajar en local.

## 7. Tu usuario del panel + TOTP

1. Abre `https://TU-SITIO/admin`. La primera vez te pide **crear el primer usuario**: tu correo y una contraseña de **12 caracteres o más** (usa un gestor de contraseñas).
2. Enseguida te mostrará un **código QR**: escanéalo con Google Authenticator, Microsoft Authenticator o Authy y escribe el código de 6 dígitos. Desde ahora te lo pedirá en cada ingreso.
3. Guarda en un lugar seguro una forma de recuperar tu app de autenticación (si pierdes el teléfono, no podrás entrar).

## 8. Enlaces de verificación (solo en el panel)

En **Contenido → Formación** y **Contenido → Certificaciones**, abre cada registro y pega su enlace en el campo **🔒 Enlace de verificación**. Ese campo nunca aparece en el sitio, el CV ni la API.

## 9. Revisar y publicar el inglés

Cada pieza tiene pestañas **Español / English** arriba a la derecha. El inglés ya tiene un borrador; revísalo y, si está bien, marca **Publicado en este idioma** (barra lateral) y guarda. El Perfil y el Aviso de privacidad en inglés están vacíos: escríbelos en la pestaña English.

## 10. Antes de decir "listo"

- [ ] `/es` y `/en` cargan; el selector ES · EN lleva a la misma página.
- [ ] Envía un mensaje de prueba desde `/es/contacto`: llega el aviso a tu correo y aparece en **Bandeja → Mensajes**.
- [ ] Descarga `/es/cv.pdf` y `/en/cv.pdf`.
- [ ] Revisa todo en tu celular.
- [ ] Cambia `NEXT_PUBLIC_NOINDEX` a `false` y redeploy.

## Respaldos

Neon guarda un historial corto para restaurar a un punto en el tiempo (revisa la ventana vigente en **Settings → Restore**). Como el repositorio es público, **no** se guardan respaldos en GitHub Actions; si quieres un respaldo semanal cifrado, lo configuramos con un repositorio privado aparte.
