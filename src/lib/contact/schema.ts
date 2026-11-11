import { z } from 'zod'

export const AREAS = [
  'analisis',
  'bi',
  'ingenieria',
  'automatizacion',
  'capacitacion',
  'empleo',
  'colaboracion',
  'otro',
] as const

/** Lista blanca de países: código ISO 3166-1 alfa-2 → prefijo telefónico. */
export const PAISES: Record<string, { prefijo: string; es: string; en: string }> = {
  EC: { prefijo: '+593', es: 'Ecuador', en: 'Ecuador' },
  AR: { prefijo: '+54', es: 'Argentina', en: 'Argentina' },
  BO: { prefijo: '+591', es: 'Bolivia', en: 'Bolivia' },
  BR: { prefijo: '+55', es: 'Brasil', en: 'Brazil' },
  CL: { prefijo: '+56', es: 'Chile', en: 'Chile' },
  CO: { prefijo: '+57', es: 'Colombia', en: 'Colombia' },
  CR: { prefijo: '+506', es: 'Costa Rica', en: 'Costa Rica' },
  DO: { prefijo: '+1', es: 'República Dominicana', en: 'Dominican Republic' },
  GT: { prefijo: '+502', es: 'Guatemala', en: 'Guatemala' },
  MX: { prefijo: '+52', es: 'México', en: 'Mexico' },
  PA: { prefijo: '+507', es: 'Panamá', en: 'Panama' },
  PE: { prefijo: '+51', es: 'Perú', en: 'Peru' },
  PY: { prefijo: '+595', es: 'Paraguay', en: 'Paraguay' },
  SV: { prefijo: '+503', es: 'El Salvador', en: 'El Salvador' },
  UY: { prefijo: '+598', es: 'Uruguay', en: 'Uruguay' },
  VE: { prefijo: '+58', es: 'Venezuela', en: 'Venezuela' },
  US: { prefijo: '+1', es: 'Estados Unidos', en: 'United States' },
  CA: { prefijo: '+1', es: 'Canadá', en: 'Canada' },
  ES: { prefijo: '+34', es: 'España', en: 'Spain' },
  GB: { prefijo: '+44', es: 'Reino Unido', en: 'United Kingdom' },
  DE: { prefijo: '+49', es: 'Alemania', en: 'Germany' },
  FR: { prefijo: '+33', es: 'Francia', en: 'France' },
  IT: { prefijo: '+39', es: 'Italia', en: 'Italy' },
  NL: { prefijo: '+31', es: 'Países Bajos', en: 'Netherlands' },
  OT: { prefijo: '', es: 'Otro país', en: 'Other country' },
}

const texto = (max: number) =>
  z
    .string()
    .trim()
    .min(1, 'requerido')
    .max(max, 'largo')
    // Sin caracteres de control (salvo saltos de línea en el mensaje).
    .refine((v) => !/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(v), 'requerido')

export const esquemaContacto = z.object({
  nombre: texto(60),
  apellido: texto(60),
  correo: z.string().trim().max(254, 'largo').pipe(z.email({ error: 'correo' })),
  pais: z.enum(Object.keys(PAISES) as [string, ...string[]], { error: 'requerido' }),
  telefono: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s()-]/g, ''))
    .refine((v) => v === '' || /^\d{6,14}$/.test(v), 'telefono'),
  area: z.enum(AREAS, { error: 'requerido' }),
  mensaje: texto(2000),
  idioma: z.enum(['es', 'en']),
})

export type DatosContacto = z.infer<typeof esquemaContacto>
export type ErroresCampo = Partial<Record<keyof DatosContacto, string>>

export type EstadoFormulario =
  | { estado: 'inicial' }
  | { estado: 'ok' }
  | { estado: 'error'; motivo: 'validacion' | 'limite' | 'verificacion' | 'servidor'; campos?: ErroresCampo }
