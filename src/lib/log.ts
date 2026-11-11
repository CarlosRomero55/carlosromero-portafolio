/**
 * Registro mínimo: solo mensajes fijos. Nunca cuerpos de petición, IP, correo,
 * teléfono ni texto del visitante.
 */
export const log = {
  warn: (evento: string) => console.warn(`[portafolio] ${evento}`),
  error: (evento: string) => console.error(`[portafolio] ${evento}`),
}
