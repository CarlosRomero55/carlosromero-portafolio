export const PAGINAS = [
  ['/es', '/en'],
  ['/es/sobre-mi', '/en/about'],
  ['/es/servicios', '/en/services'],
  ['/es/proyectos', '/en/projects'],
  ['/es/contacto', '/en/contact'],
  ['/es/privacidad', '/en/privacy'],
] as const

export const TODAS = [
  ...PAGINAS.flat(),
  '/es/proyectos/shrimp-intelligence-ecuador',
  '/es/proyectos/sistema-escolar',
  '/es/proyectos?tipo=web',
]
