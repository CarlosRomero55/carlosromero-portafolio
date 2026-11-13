/**
 * Contenido v2 (13 nov 2026): caso de estudio de Shrimp, proyecto Sistema escolar,
 * catálogo de servicios y LinkedIn. Fuente: los repositorios públicos de Carlos
 * (shrimp-intelligence-ecuador, escuela-autorizaciones) y lo que confirmó en el chat.
 *
 * Reglas para no pisar el trabajo de Carlos en el panel:
 *  - Un campo nuevo solo se llena si está vacío.
 *  - Un texto que cargó el seed inicial solo se reemplaza si sigue IGUAL al del seed.
 *  - Nunca borra registros. No toca el inglés.
 * Uso: pnpm contenido   (se puede ejecutar varias veces; la segunda no cambia nada)
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { doc, p, ul } from './lexical'

type Rec = Record<string, unknown>
const vacio = (v: unknown) =>
  v === null || v === undefined || v === '' || (Array.isArray(v) && v.length === 0) || v === 'ninguno'
const textoDe = (v: unknown) => JSON.stringify(v ?? '')
/** true si el valor actual sigue siendo el que puso el seed (empieza igual). */
const esDelSeed = (actual: unknown, inicio: string) =>
  typeof actual === 'string' ? actual.startsWith(inicio) : textoDe(actual).includes(inicio)

const SHRIMP_REPO = 'https://github.com/CarlosRomero55/shrimp-intelligence-ecuador'
const ESCUELA_REPO = 'https://github.com/CarlosRomero55/escuela-autorizaciones'
const ESCUELA_DEMO = 'https://escuela-demo.onrender.com'
const LINKEDIN = 'https://www.linkedin.com/in/carlos-romero-data/'

async function main() {
  const payload = await getPayload({ config })
  const cambios: string[] = []

  /** Aplica `data` solo en los campos que pasan la regla y registra qué cambió. */
  async function actualizar(collection: 'proyectos' | 'servicios', docActual: Rec, data: Rec, etiqueta: string) {
    if (Object.keys(data).length === 0) return
    await payload.update({ collection, id: docActual.id as number, locale: 'es', data: data as never })
    cambios.push(`${etiqueta}: ${Object.keys(data).join(', ')}`)
  }
  function siVacio(destino: Rec, actual: Rec, campo: string, valor: unknown) {
    if (vacio(actual[campo])) destino[campo] = valor
  }
  function siSeed(destino: Rec, actual: Rec, campo: string, inicioSeed: string, valor: unknown) {
    if (vacio(actual[campo]) || esDelSeed(actual[campo], inicioSeed)) destino[campo] = valor
  }

  // ——— Perfil: LinkedIn ———
  const perfil = (await payload.findGlobal({ slug: 'perfil', locale: 'es' })) as unknown as Rec
  if (vacio(perfil.linkedin)) {
    await payload.updateGlobal({ slug: 'perfil', locale: 'es', data: { linkedin: LINKEDIN } })
    cambios.push('Perfil: linkedin')
  }

  // ——— Shrimp Intelligence Ecuador ———
  const shrimp = (
    await payload.find({ collection: 'proyectos', locale: 'es', where: { slug: { equals: 'shrimp-intelligence-ecuador' } }, limit: 1, depth: 0 })
  ).docs[0] as unknown as Rec | undefined
  if (shrimp) {
    const d: Rec = {}
    siVacio(d, shrimp, 'titular', 'China compra la mitad del camarón ecuatoriano, y es el mercado que menos paga por libra.')
    if (!shrimp.portada) {
      siVacio(d, shrimp, 'portadaRuta', '/proyectos/shrimp/01_resumen.webp')
      siVacio(d, shrimp, 'portadaAlt', 'Dashboard de Power BI con el resumen de exportaciones de camarón de Ecuador: indicadores del año, valor mensual con promedio móvil, mapa de destinos y los 10 principales mercados.')
    }
    siVacio(d, shrimp, 'portadaEtiqueta', 'Power BI · 5 páginas')
    if (!shrimp.destacado) d.destacado = true
    siVacio(d, shrimp, 'destacados', [
      { cifra: '42–52 %', texto: 'del valor lo compra China' },
      { cifra: '141', texto: 'pruebas automáticas' },
      { cifra: '104', texto: 'meses cuadrados con el BCE' },
    ])
    siVacio(d, shrimp, 'hallazgos', [
      { cifra: '8.401 M', texto: 'USD exportados en 2025, 2,6 veces lo de 2018', tono: 'destacado' },
      { cifra: '42–52 %', texto: 'del valor lo compra China cada año (2019–2024)', tono: 'normal' },
      { cifra: '+64 %', texto: 'más paga EE. UU. por libra que China (2026, 3 meses con dato)', tono: 'normal' },
      { cifra: '−314 M', texto: 'USD si China pagara 10 % menos (escenario 2024)', tono: 'riesgo' },
    ])
    const ficha = (shrimp.ficha ?? {}) as Rec
    if (vacio(ficha.tipo) && vacio(ficha.periodo) && vacio(ficha.fuentesDatos) && vacio(ficha.calidad)) {
      d.ficha = {
        tipo: 'Análisis + ingeniería de datos',
        periodo: 'Enero 2018 – agosto 2026',
        fuentesDatos: 'Banco Central del Ecuador (cuadro 3.1.2) · UN Comtrade',
        calidad: '141 pruebas · el total cuadra con el BCE en 104 meses',
      }
    }
    siVacio(d, shrimp, 'pasos', [
      { etiqueta: 'FUENTES', titulo: 'BCE + UN Comtrade', texto: 'Total oficial y detalle por país', color: 'ninguno' },
      { etiqueta: 'BRONZE', titulo: 'Crudo', texto: 'Tal como llega', color: 'bronze' },
      { etiqueta: 'SILVER', titulo: 'Limpio y conciliado', texto: '3FN, países unificados', color: 'silver' },
      { etiqueta: 'GOLD', titulo: 'Modelo estrella', texto: '2 hechos, 6 dimensiones', color: 'gold' },
      { etiqueta: 'CONSUMO', titulo: 'SQL · API · Power BI', texto: 'Las tres dan la misma cifra', color: 'ninguno' },
    ])
    siVacio(d, shrimp, 'decisiones', [
      { titulo: 'Exportadoras', texto: 'Medir cuánto depende su ingreso de un solo mercado y planificar la diversificación hacia los que pagan más.' },
      { titulo: 'Gremio y política', texto: 'Seguir el HHI y un escenario de estrés como indicadores del sector, no solo el volumen.' },
      { titulo: 'Finca', texto: 'Cosechar a la talla que más margen deja (análisis con datos SIMULADOS de una finca ficticia).' },
    ])
    if (vacio(shrimp.simulador)) d.simulador = 'china-2024'
    siVacio(d, shrimp, 'repositorio', SHRIMP_REPO)
    siVacio(d, shrimp, 'enlaces', [{ texto: 'Dashboard en PDF', url: `${SHRIMP_REPO}/blob/main/docs/powerbi/shrimp_intelligence_dashboard.pdf` }])
    siVacio(d, shrimp, 'capturas', [
      {
        ruta: '/proyectos/shrimp/02_mercados.webp',
        alt: 'Análisis de mercados: participación de cada destino en el valor exportado, precio por libra de China, EE. UU. y Europa, estacionalidad mensual y tabla de destinos.',
        titulo: 'Mercados',
        leyenda: 'China paga cada vez menos por libra: de 2,73 USD (2018) a 2,13 USD (2026), mientras EE. UU. sube a 3,49. Mayo es el mes más fuerte (índice 116) y enero el más débil (82).',
      },
      {
        ruta: '/proyectos/shrimp/05_conciliacion.webp',
        alt: 'Conciliación de las exportaciones declaradas por Ecuador frente al Banco Central del Ecuador y frente a lo que registran los países compradores, por año, por mes y por país.',
        titulo: 'Conciliación de fuentes',
        leyenda: 'Cada fuente sirve para una pregunta distinta: lo que declara Ecuador se acerca al BCE en el año (de −7,7 % a −1,1 %), pero las cifras espejo varían hasta ±50 % por mes y solo 9 de 38 países coinciden.',
      },
      {
        ruta: '/proyectos/shrimp/04_finca.webp',
        alt: 'Análisis de rentabilidad de una finca camaronera con datos simulados: margen por precio de venta, margen por talla de cosecha y ranking de piscinas.',
        titulo: 'Finca (SIMULADO)',
        leyenda: 'DATOS SIMULADOS de una finca ficticia: el método es real, las cifras no describen a ninguna empresa. La talla de cosecha decide el margen: 20/30 deja 54,6 % frente a 27,8 % de 50/60.',
      },
    ])
    const tecSeed = ['MySQL', 'Python', 'Power BI']
    if (JSON.stringify(shrimp.tecnologias) === JSON.stringify(tecSeed) || vacio(shrimp.tecnologias)) {
      d.tecnologias = ['MySQL', 'Python', 'pandas', 'FastAPI', 'Power BI']
    }
    siSeed(d, shrimp, 'resumen', 'Análisis de las exportaciones de camarón de Ecuador con un modelo', 'Pipeline, API y dashboard sobre las exportaciones de camarón (2018–2026): de fuentes públicas que no coinciden a cifras conciliadas y un simulador de riesgo.')
    siSeed(d, shrimp, 'preguntaNegocio', '¿Cómo han evolucionado las exportaciones ecuatorianas de camarón', '¿Quién compra el camarón ecuatoriano, a qué precio, con qué riesgo, y qué tan confiables son las cifras para decidir?')
    siSeed(d, shrimp, 'problema', 'El camarón es uno de los principales productos de exportación de Ecuador', doc(
      p('El camarón es la primera exportación no petrolera del Ecuador: 8.401 M USD en 2025, 2,6 veces lo de 2018. Pero sus datos están dispersos y no coinciden.'),
      ul([
        'El Banco Central (BCE) publica el total oficial, pero no el detalle por país.',
        'UN Comtrade tiene el detalle por país en dos versiones: lo que declara Ecuador (FOB) y lo que declaran los compradores (espejo, CIF), que difieren hasta ±50 % por mes.',
        'En 2025 China no reportó sus importaciones, y más de la mitad del valor quedó sin país identificado.',
      ]),
    ))
    siSeed(d, shrimp, 'metodo', 'Organicé los datos en MySQL con una arquitectura Medallion', doc(
      p('Construí un pipeline batch e incremental de 7 etapas en Python que lleva los datos crudos a un modelo listo para analizar en MySQL 8, con arquitectura Medallion. Cada corrida queda registrada en una bitácora.'),
    ))
    siSeed(d, shrimp, 'datosLimpieza', 'Reuní datos de fuentes oficiales y los cargué sin cambios', doc(
      p('El total de cada mes es el del BCE; el detalle por país viene de lo que declara Ecuador, y las cifras espejo se usan solo donde falta. Unifiqué nombres de países con una tabla de alias y medí las diferencias entre fuentes en lugar de esconderlas.'),
      p('La calidad se comprueba con 141 pruebas automáticas: reglas de limpieza, integridad de las capas silver y gold, bitácora y API. El total preferido cuadra con el BCE en los 104 meses, y SQL, API y Power BI dan la misma cifra.'),
    ))
    siSeed(d, shrimp, 'resultado', 'Un dashboard en Power BI que permite seguir', doc(
      p('Un reporte de Power BI de 5 páginas (Resumen, Mercados, Simulador, Finca y Conciliación), una API de solo lectura con FastAPI y 12 consultas SQL de negocio. El sector creció por volumen, no por precio: entre 2018 y 2020 vendió 39 % más libras a un precio 11 % menor.'),
    ))
    siSeed(d, shrimp, 'aprendizajes', 'Separar los datos en capas facilita', doc(
      p('Cuando las fuentes no coinciden, lo útil es medir la diferencia y decir para qué sirve cada una, no elegir una y esconder la otra.'),
      p('Próximos pasos: pronóstico de exportaciones mensuales, simulación Monte Carlo del riesgo de concentración, datos por tipo de producto y llevar el pipeline a la nube con actualización programada.'),
    ))
    const graf = shrimp.graficos as Rec[] | undefined
    if (Array.isArray(graf) && graf.length === 1 && graf[0].archivo === 'camaron-exportaciones') d.graficos = []
    const seo = (shrimp.seo ?? {}) as Rec
    if (vacio(seo.titulo) || esDelSeed(seo.titulo, 'Shrimp Intelligence Ecuador — exportaciones de camarón')) {
      d.seo = {
        titulo: 'Shrimp Intelligence Ecuador — caso de estudio',
        descripcion: 'China compra la mitad del camarón ecuatoriano y es quien menos paga por libra. Pipeline, API y dashboard con simulador de riesgo.',
      }
    }
    await actualizar('proyectos', shrimp, d, 'Shrimp')
  } else {
    cambios.push('Shrimp: no se encontró (sin cambios)')
  }

  // ——— Sistema escolar (nuevo) ———
  const existeEscuela = await payload.count({ collection: 'proyectos', where: { slug: { equals: 'sistema-escolar' } }, locale: 'es' })
  let escuelaId: number | string | null = null
  if (existeEscuela.totalDocs === 0) {
    const e = await payload.create({
      collection: 'proyectos',
      locale: 'es',
      data: {
        publicado: true,
        orden: 2,
        destacado: true,
        titulo: 'Sistema escolar',
        slug: 'sistema-escolar',
        area: 'web',
        titular: 'Cada persona ve solo lo que le corresponde: un sistema escolar con permisos según la relación real con los datos.',
        resumen: 'Plataforma para una escuela primaria con portales por rol, autorizaciones digitales y una app de portería que funciona sin internet. Datos ficticios.',
        tecnologias: ['Python', 'FastAPI', 'PostgreSQL', 'SQLAlchemy', 'HTMX'],
        portadaRuta: '/proyectos/escuela/portal_docente.webp',
        portadaAlt: 'Portal de una docente en el sistema escolar: clases asignadas, alumnos y entregas por calificar. Datos ficticios.',
        portadaEtiqueta: 'Demo en línea',
        destacados: [
          { cifra: '2FA', texto: 'segundo factor por rol' },
          { cifra: '209', texto: 'pruebas automáticas' },
          { cifra: 'PWA', texto: 'portería sin conexión' },
        ],
        hallazgos: [
          { cifra: '209', texto: 'pruebas en SQLite y PostgreSQL, incluidos los intentos de acceso cruzado entre roles', tono: 'destacado' },
          { cifra: '2FA', texto: 'segundo factor obligatorio por rol, con código QR generado en el servidor', tono: 'normal' },
          { cifra: 'AES-256', texto: 'cifrado de documentos y secretos; contraseñas con argon2', tono: 'normal' },
          { cifra: '12 h', texto: 'dura el padrón sin conexión de portería; después se borra del teléfono', tono: 'normal' },
        ],
        ficha: {
          tipo: 'Sistema web a medida',
          periodo: 'Año lectivo 2026-2027 (datos ficticios)',
          fuentesDatos: 'Datos ficticios: 120 alumnos, 110 familias y 8 docentes',
          calidad: '209 pruebas en SQLite y PostgreSQL · lint con ruff',
        },
        preguntaNegocio: '¿Cómo puede una escuela organizar clases, autorizaciones y la entrega de alumnos sin papeles, y sin que nadie vea datos que no le corresponden?',
        problema: doc(
          p('En una escuela, las autorizaciones de salidas, las tareas y la lista de quién puede retirar a cada alumno suelen ir en papel o por mensajes sueltos. Eso se pierde, no deja registro y expone datos de menores a personas que no deberían verlos.'),
        ),
        metodo: doc(
          p('Diseñé el sistema alrededor de los permisos: cada rol (administración, coordinación, directivos, docentes, consejería, auditoría, portería, representantes y estudiantes) ve solo los datos con los que tiene una relación real. Un representante solo ve a sus representados validados y un docente solo a los alumnos de sus salones.'),
        ),
        datosLimpieza: doc(
          p('Seguridad desde el diseño: contraseñas con argon2, tokens y códigos con HMAC, documentos y secretos TOTP cifrados con AES-256-GCM, sesiones en el servidor con lista de dispositivos y cierre remoto, y una bitácora que PostgreSQL no permite modificar ni borrar.'),
          p('El administrador debe justificar cada consulta a los datos de un alumno, y ese motivo queda registrado. Todos los datos de la demo son ficticios.'),
        ),
        pasos: [
          { etiqueta: 'ROLES', titulo: 'Permisos por relación', texto: 'Cada rol ve solo lo suyo', color: 'ninguno' },
          { etiqueta: 'ACCESO', titulo: 'Sesiones y 2FA', texto: 'Dispositivos y alertas', color: 'ninguno' },
          { etiqueta: 'CLASES', titulo: 'Tareas y notas', texto: 'Entregas, rúbricas, promedios', color: 'ninguno' },
          { etiqueta: 'FAMILIAS', titulo: 'Autorizaciones', texto: 'Enlace personal, sin usuario', color: 'ninguno' },
          { etiqueta: 'PORTERÍA', titulo: 'App sin conexión', texto: 'Instalable (PWA)', color: 'ninguno' },
        ],
        resultado: doc(
          p('Una plataforma publicada con portales por rol, clases con tareas y calificaciones según el Instructivo de Evaluación 2025, autorizaciones digitales con seguimiento por salón y una aplicación de portería instalable que sigue funcionando sin internet.'),
        ),
        capturas: [
          {
            ruta: '/proyectos/escuela/autorizaciones.webp',
            alt: 'Campaña de autorización de una salida pedagógica: porcentaje de avance, respuestas por salón y lista de alumnos con quién firmó. Datos ficticios.',
            titulo: 'Autorizaciones digitales',
            leyenda: 'Coordinación ve en tiempo real cuántas familias autorizaron una salida, por salón, quién firmó y cuándo, y puede exportar el registro.',
          },
        ],
        decisiones: [
          { titulo: 'Dirección', texto: 'Saber en tiempo real qué familias autorizaron una actividad y tener el respaldo exportable.' },
          { titulo: 'Portería', texto: 'Entregar a cada alumno solo a una persona autorizada, aun sin internet.' },
          { titulo: 'Familias', texto: 'Autorizar desde un enlace personal, sin crear usuario ni contraseña.' },
        ],
        aprendizajes: doc(
          p('Próximos pasos: sitio público de la escuela, portal del representante, boletines, bienestar estudiantil y evaluaciones, ya diseñados en la arquitectura del proyecto.'),
        ),
        demo: ESCUELA_DEMO,
        repositorio: ESCUELA_REPO,
        contieneDatosSimulados: false,
        seo: {
          titulo: 'Sistema escolar — caso de estudio',
          descripcion: 'Sistema web para una escuela: portales por rol, autorizaciones digitales y portería sin conexión. FastAPI y PostgreSQL.',
        },
      } as never,
    })
    escuelaId = e.id
    cambios.push('Sistema escolar: creado y publicado en español')
  } else {
    const e = (await payload.find({ collection: 'proyectos', where: { slug: { equals: 'sistema-escolar' } }, limit: 1, locale: 'es' })).docs[0]
    escuelaId = e.id
  }

  // ——— Servicios ———
  const servicios = (await payload.find({ collection: 'servicios', locale: 'es', limit: 100, depth: 0, sort: 'orden' })).docs as unknown as Rec[]
  const porNombre = (n: string) => servicios.find((s) => s.nombre === n)
  const shrimpId = shrimp?.id ?? null

  const planServicios: { nombre: string; descSeed: string; data: Rec }[] = [
    {
      nombre: 'Análisis de datos y Business Intelligence',
      descSeed: 'Dashboards e indicadores en Power BI',
      data: {
        nombre: 'Dashboards y Business Intelligence',
        descripcion: 'Tus datos están en Excel o en el sistema, pero nadie los ve juntos.',
        dolor: 'Me entero de cómo va el negocio a fin de mes.',
        grupo: 'datos',
        icono: 'grafico',
        herramientas: ['Power BI', 'DAX', 'SQL', 'Excel'],
        entregables: [
          { texto: 'Dashboard en Power BI con los indicadores que definimos juntos' },
          { texto: 'Títulos que dicen la conclusión, no solo el gráfico' },
          { texto: 'Guía de uso y actualización' },
        ],
        estado: 'disponible',
        proyectoEjemplo: shrimpId,
      },
    },
    {
      nombre: 'Ingeniería de datos',
      descSeed: 'Modelos de datos por capas y procesos ETL',
      data: {
        nombre: 'Ingeniería de datos y ETL',
        descripcion: 'La información está repartida en archivos y sistemas que no coinciden.',
        dolor: 'Cada reporte da una cifra distinta.',
        grupo: 'datos',
        icono: 'base',
        herramientas: ['Python', 'pandas', 'MySQL', 'PostgreSQL'],
        entregables: [
          { texto: 'Base de datos ordenada por capas (bronze, silver, gold)' },
          { texto: 'Procesos de carga automáticos y con pruebas de calidad' },
          { texto: 'Documentación de cada decisión' },
        ],
        estado: 'disponible',
        proyectoEjemplo: shrimpId,
      },
    },
    {
      nombre: 'Automatización de procesos',
      descSeed: 'Automatización de reportes y tareas repetitivas',
      data: {
        descripcion: 'El mismo reporte se arma a mano cada semana.',
        dolor: 'Pasamos horas copiando y pegando.',
        grupo: 'datos',
        icono: 'rayo',
        herramientas: ['Python', 'Excel'],
        entregables: [
          { texto: 'Un proceso que junta y limpia los archivos solo' },
          { texto: 'El reporte listo en un clic' },
          { texto: 'Manual corto para tu equipo' },
        ],
        estado: 'proximamente',
      },
    },
  ]
  for (const plan of planServicios) {
    const s = porNombre(plan.nombre) ?? porNombre(String(plan.data.nombre ?? ''))
    if (!s) continue
    const d: Rec = {}
    if (plan.data.nombre && s.nombre === plan.nombre) d.nombre = plan.data.nombre
    siSeed(d, s, 'descripcion', plan.descSeed, plan.data.descripcion)
    for (const campo of ['dolor', 'entregables', 'proyectoEjemplo'] as const) {
      if (plan.data[campo] !== undefined && plan.data[campo] !== null) siVacio(d, s, campo, plan.data[campo])
    }
    // Campos de catálogo con valor por defecto: solo si nunca se tocaron.
    if (vacio(s.dolor)) {
      d.grupo = plan.data.grupo
      d.icono = plan.data.icono
      d.estado = plan.data.estado
      d.herramientas = plan.data.herramientas
    }
    await actualizar('servicios', s, d, `Servicio "${plan.data.nombre ?? plan.nombre}"`)
  }

  const nuevos: Rec[] = [
    {
      orden: 4,
      nombre: 'Sistemas web a medida',
      descripcion: 'Necesitas que cada persona vea solo lo suyo.',
      dolor: 'Todo va por papel y WhatsApp, y se pierde.',
      grupo: 'sistemas',
      icono: 'pantalla',
      herramientas: ['Python', 'FastAPI', 'PostgreSQL'],
      entregables: [
        { texto: 'Sistema web con usuarios y permisos por rol' },
        { texto: 'Seguridad: segundo factor, datos cifrados y bitácora' },
        { texto: 'Publicado en internet y con pruebas automáticas' },
      ],
      estado: 'disponible',
      proyectoEjemplo: escuelaId,
      demoUrl: ESCUELA_DEMO,
    },
    {
      orden: 5,
      nombre: 'Inventario y punto de venta',
      descripcion: 'Compras, ventas y stock en un solo lugar.',
      dolor: 'No sé cuánto stock tengo ni cuánto vendí hoy.',
      grupo: 'sistemas',
      icono: 'caja',
      herramientas: [],
      entregables: [{ texto: 'Inventario, compras y ventas en un solo lugar' }, { texto: 'Caja diaria y reportes' }],
      estado: 'proximamente',
    },
  ]
  for (const n of nuevos) {
    if (porNombre(String(n.nombre))) continue
    await payload.create({ collection: 'servicios', locale: 'es', data: { ...n, publicado: true } as never })
    cambios.push(`Servicio "${n.nombre}": creado`)
  }

  console.log(cambios.length ? `Cambios:\n- ${cambios.join('\n- ')}` : 'Sin cambios: todo estaba al día.')
  process.exit(0)
}

main().catch((e) => {
  console.error('Contenido v2 falló:', e instanceof Error ? e.message : e)
  process.exit(1)
})
