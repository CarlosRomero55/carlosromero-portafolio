import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { es } from '@payloadcms/translations/languages/es'
import { en } from '@payloadcms/translations/languages/en'
import path from 'path'
import { buildConfig } from 'payload'
import { payloadTotp } from 'payload-totp'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Certificaciones, Formacion } from './collections/Formacion'
import { Mensajes, RateLimit } from './collections/Internas'
import { Media } from './collections/Media'
import { Proyectos } from './collections/Proyectos'
import { Idiomas, Servicios } from './collections/Simples'
import { Trayectoria } from './collections/Trayectoria'
import { RegistroAccesos, Usuarios } from './collections/Usuarios'
import { Perfil, TextosSitio } from './globals'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const siteURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const blobToken = process.env.BLOB_READ_WRITE_TOKEN

export default buildConfig({
  serverURL: siteURL,
  csrf: [siteURL],
  cors: [siteURL],
  admin: {
    user: Usuarios.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' · Panel del portafolio', robots: 'noindex, nofollow' },
  },
  i18n: { supportedLanguages: { es, en }, fallbackLanguage: 'es' },
  // D3: localización nativa, sin fallback.
  localization: {
    locales: [
      { code: 'es', label: 'Español' },
      { code: 'en', label: 'English' },
    ],
    defaultLocale: 'es',
    fallback: false,
  },
  // D5: sin GraphQL.
  graphQL: { disable: true },
  collections: [
    Proyectos,
    Trayectoria,
    Formacion,
    Certificaciones,
    Servicios,
    Idiomas,
    Media,
    Mensajes,
    Usuarios,
    RegistroAccesos,
    RateLimit,
  ],
  globals: [Perfil, TextosSitio],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    // En producción el esquema cambia solo con migraciones (pnpm migrate).
    // El esquema cambia SOLO con migraciones (pnpm migrate:create / pnpm migrate), también en local.
    push: process.env.PAYLOAD_DB_PUSH === 'true',
    prodMigrations: migrations,
  }),
  sharp,
  telemetry: false,
  plugins: [
    // D7: medios en Vercel Blob. Sin token (desarrollo local) se guardan en disco.
    vercelBlobStorage({
      enabled: Boolean(blobToken),
      collections: { media: { disablePayloadAccessControl: true } },
      token: blobToken,
    }),
    // D10: TOTP obligatorio. Debe ir al final.
    payloadTotp({
      collection: 'usuarios',
      forceSetup: true,
      disabled: process.env.TOTP_DISABLED === 'true' && process.env.NODE_ENV !== 'production',
      totp: { issuer: 'Portafolio Carlos Romero' },
    }),
  ],
})
