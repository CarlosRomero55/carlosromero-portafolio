export const PAGINAS = [
  ['/es', '/en'],
  ['/es/sobre-mi', '/en/about'],
  ['/es/servicios', '/en/services'],
  ['/es/proyectos', '/en/projects'],
  ['/es/articulos', '/en/articles'],
  ['/es/contacto', '/en/contact'],
  ['/es/privacidad', '/en/privacy'],
] as const

export const TODAS = [
  ...PAGINAS.flat(),
  '/es/proyectos/shrimp-intelligence-ecuador',
  '/es/proyectos/sistema-escolar',
  '/es/proyectos?tipo=web',
  '/en/projects/shrimp-intelligence-ecuador',
  '/en/projects/school-management-system',
  '/es/articulos/cuando-las-fuentes-no-coinciden',
  '/en/articles/when-sources-dont-match',
]
