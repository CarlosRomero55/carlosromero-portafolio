import type { CollectionConfig, Field } from 'payload'
import { accesoAdmin, campoInterno } from '../access'
import { campoOrden, campoPublicado } from '../fields/publicacion'
import { hooksPublicos } from '../hooks/revalidar'

const SLUG_VALIDO = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const seccion = (name: string, es: string, en: string): Field => ({
  name,
  type: 'richText',
  localized: true,
  label: { es, en },
})

export const Proyectos: CollectionConfig = {
  slug: 'proyectos',
  labels: { singular: 'Proyecto', plural: 'Proyectos' },
  admin: {
    useAsTitle: 'titulo',
    group: 'Contenido',
    defaultColumns: ['titulo', 'area', 'publicado', 'orden'],
  },
  access: accesoAdmin,
  hooks: hooksPublicos,
  defaultSort: 'orden',
  fields: [
    campoPublicado([
      'titulo',
      'slug',
      'resumen',
      'preguntaNegocio',
      'problema',
      'datosLimpieza',
      'metodo',
      'resultado',
      'aprendizajes',
    ]),
    campoOrden,
    { name: 'titulo', type: 'text', localized: true, label: { es: 'Título', en: 'Title' } },
    {
      name: 'slug',
      type: 'text',
      localized: true,
      index: true,
      label: { es: 'Dirección (slug)', en: 'Slug' },
      admin: { description: 'Solo minúsculas, números y guiones. Ej.: exportaciones-de-camaron' },
      validate: (v: string | null | undefined) =>
        !v || SLUG_VALIDO.test(v) || 'Solo a-z, 0-9 y guiones (sin tildes ni espacios).',
    },
    {
      name: 'area',
      type: 'select',
      required: true,
      defaultValue: 'ambos',
      options: [
        { label: 'Análisis de datos', value: 'analisis' },
        { label: 'Ingeniería de datos', value: 'ingenieria' },
        { label: 'Análisis e ingeniería', value: 'ambos' },
      ],
    },
    {
      name: 'tecnologias',
      type: 'text',
      hasMany: true,
      label: 'Tecnologías',
      admin: { description: 'Ej.: MySQL, Python, Power BI' },
    },
    {
      name: 'resumen',
      type: 'textarea',
      localized: true,
      maxLength: 200,
      label: { es: 'Resumen (tarjeta)', en: 'Summary (card)' },
    },
    {
      name: 'preguntaNegocio',
      type: 'textarea',
      localized: true,
      label: { es: 'Pregunta de negocio', en: 'Business question' },
    },
    seccion('problema', 'Problema', 'Problem'),
    seccion('datosLimpieza', 'Datos y limpieza', 'Data and cleaning'),
    seccion('metodo', 'Método', 'Method'),
    seccion('resultado', 'Resultado', 'Result'),
    seccion('aprendizajes', 'Aprendizajes', 'What I learned'),
    {
      name: 'graficos',
      type: 'array',
      label: 'Gráficos (datos SIMULADOS)',
      admin: { description: 'Cada gráfico usa un archivo de data/synthetic/ y siempre se marca como SIMULADO.' },
      fields: [
        {
          name: 'archivo',
          type: 'select',
          required: true,
          options: [{ label: 'Camarón — exportaciones mensuales (simulado)', value: 'camaron-exportaciones' }],
        },
        { name: 'titulo', type: 'text', localized: true },
      ],
    },
    {
      name: 'capturas',
      type: 'array',
      fields: [{ name: 'imagen', type: 'upload', relationTo: 'media', required: true }],
    },
    {
      name: 'contieneDatosSimulados',
      type: 'checkbox',
      defaultValue: true,
      label: 'Contiene datos simulados (muestra aviso)',
    },
    {
      name: 'fuentes',
      type: 'array',
      label: 'Fuentes (cifras oficiales)',
      fields: [
        { name: 'nombre', type: 'text', localized: true, required: true },
        {
          name: 'url',
          type: 'text',
          required: true,
          validate: (v: string | null | undefined) => !v || /^https:\/\//.test(v) || 'Debe empezar con https://',
        },
        { name: 'fechaConsulta', type: 'date', required: true, admin: { date: { pickerAppearance: 'dayOnly' } } },
      ],
    },
    {
      name: 'repositorio',
      type: 'text',
      admin: { description: 'Déjalo vacío mientras el repositorio sea privado.' },
      validate: (v: string | null | undefined) =>
        !v || /^https:\/\/github\.com\/CarlosRomero55\/[A-Za-z0-9._-]+\/?$/.test(v) || 'Debe ser https://github.com/CarlosRomero55/…',
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'titulo', type: 'text', localized: true },
        { name: 'descripcion', type: 'textarea', localized: true, maxLength: 160 },
      ],
    },
    {
      name: 'notasInternas',
      type: 'textarea',
      localized: true,
      label: '🔒 Notas internas (nunca públicas)',
      access: { read: campoInterno, update: campoInterno, create: campoInterno },
    },
  ],
}
