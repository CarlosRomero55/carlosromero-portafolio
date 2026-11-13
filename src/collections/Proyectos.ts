import type { CollectionConfig, Field } from 'payload'
import { accesoAdmin, campoInterno } from '../access'
import { campoOrden, campoPublicado } from '../fields/publicacion'
import { hooksPublicos } from '../hooks/revalidar'

const SLUG_VALIDO = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const RUTA_ESTATICA = /^\/proyectos\/[a-z0-9-]+\/[a-z0-9_-]+\.(webp|png|jpg)$/
const URL_HTTPS = (v: string | null | undefined) => !v || /^https:\/\/[^\s]+$/.test(v) || 'Debe empezar con https://'
const rutaValida = (v: string | null | undefined) =>
  !v || RUTA_ESTATICA.test(v) || 'Debe ser una imagen de la carpeta del sitio: /proyectos/<proyecto>/<archivo>.webp'

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
        { label: 'Sistema web a medida', value: 'web' },
      ],
    },
    {
      name: 'destacado',
      type: 'checkbox',
      defaultValue: false,
      label: 'Destacado en la portada',
      admin: { position: 'sidebar' },
    },
    {
      name: 'titular',
      type: 'textarea',
      localized: true,
      maxLength: 160,
      label: { es: 'Titular del caso (el hallazgo principal)', en: 'Case headline' },
      admin: { description: 'Ej.: "China compra la mitad del camarón ecuatoriano, y es el mercado que menos paga por libra."' },
    },
    {
      type: 'collapsible',
      label: 'Imagen principal',
      fields: [
        { name: 'portada', type: 'upload', relationTo: 'media', label: 'Subir imagen' },
        {
          name: 'portadaRuta',
          type: 'text',
          label: 'o ruta de imagen del sitio',
          admin: { description: 'Solo si no subes una imagen. Ej.: /proyectos/shrimp/01_resumen.webp' },
          validate: rutaValida,
        },
        { name: 'portadaAlt', type: 'text', localized: true, label: 'Texto alternativo (para la ruta)' },
        { name: 'portadaEtiqueta', type: 'text', localized: true, label: 'Etiqueta sobre la imagen', admin: { description: 'Ej.: Power BI · 5 páginas' } },
      ],
    },
    {
      name: 'destacados',
      type: 'array',
      maxRows: 3,
      label: 'Datos de la tarjeta (máx. 3)',
      fields: [
        { name: 'cifra', type: 'text', required: true, admin: { description: 'Ej.: 42–52 %' } },
        { name: 'texto', type: 'text', localized: true, required: true },
      ],
    },
    {
      name: 'hallazgos',
      type: 'array',
      maxRows: 4,
      label: 'En resumen: hallazgos (máx. 4)',
      fields: [
        { name: 'cifra', type: 'text', required: true },
        { name: 'texto', type: 'text', localized: true, required: true },
        {
          name: 'tono',
          type: 'select',
          defaultValue: 'normal',
          options: [
            { label: 'Normal', value: 'normal' },
            { label: 'Destacado (degradado)', value: 'destacado' },
            { label: 'Riesgo (rojo)', value: 'riesgo' },
          ],
        },
      ],
    },
    {
      name: 'ficha',
      type: 'group',
      label: 'Ficha técnica',
      fields: [
        { name: 'tipo', type: 'text', localized: true },
        { name: 'periodo', type: 'text', localized: true },
        { name: 'fuentesDatos', type: 'text', localized: true, label: 'Fuentes de datos' },
        { name: 'calidad', type: 'text', localized: true },
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
      name: 'pasos',
      type: 'array',
      label: 'Qué hice: pasos del proceso (diagrama)',
      fields: [
        { name: 'etiqueta', type: 'text', required: true, admin: { description: 'Ej.: BRONZE' } },
        { name: 'titulo', type: 'text', localized: true, required: true },
        { name: 'texto', type: 'text', localized: true },
        {
          name: 'color',
          type: 'select',
          defaultValue: 'ninguno',
          options: [
            { label: 'Sin color', value: 'ninguno' },
            { label: 'Bronce', value: 'bronze' },
            { label: 'Plata', value: 'silver' },
            { label: 'Oro', value: 'gold' },
          ],
        },
      ],
    },
    {
      name: 'decisiones',
      type: 'array',
      maxRows: 3,
      label: 'Qué decisiones permite (máx. 3)',
      fields: [
        { name: 'titulo', type: 'text', localized: true, required: true },
        { name: 'texto', type: 'textarea', localized: true, required: true },
      ],
    },
    {
      name: 'simulador',
      type: 'select',
      defaultValue: 'ninguno',
      label: 'Simulador interactivo',
      options: [
        { label: 'Ninguno', value: 'ninguno' },
        { label: 'Riesgo China 2024 (Shrimp)', value: 'china-2024' },
      ],
    },
    {
      name: 'demo',
      type: 'text',
      label: 'Enlace a la demo publicada',
      validate: URL_HTTPS,
    },
    {
      name: 'enlaces',
      type: 'array',
      label: 'Otros enlaces (PDF, documentación)',
      maxRows: 3,
      fields: [
        { name: 'texto', type: 'text', localized: true, required: true },
        { name: 'url', type: 'text', required: true, validate: URL_HTTPS },
      ],
    },
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
      label: 'Capturas (Qué encontré)',
      fields: [
        { name: 'imagen', type: 'upload', relationTo: 'media', label: 'Subir imagen' },
        { name: 'ruta', type: 'text', label: 'o ruta de imagen del sitio', validate: rutaValida },
        { name: 'alt', type: 'text', localized: true, label: 'Texto alternativo (para la ruta)' },
        { name: 'titulo', type: 'text', localized: true, label: 'Título de la ventana', admin: { description: 'Ej.: Mercados' } },
        { name: 'leyenda', type: 'textarea', localized: true, label: 'Leyenda: qué muestra y qué concluir' },
      ],
      validate: (filas: unknown) => {
        const lista = Array.isArray(filas) ? (filas as { imagen?: unknown; ruta?: string }[]) : []
        const sinImagen = lista.findIndex((f) => !f.imagen && !f.ruta)
        return sinImagen === -1 || `La captura ${sinImagen + 1} necesita una imagen subida o una ruta.`
      },
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
