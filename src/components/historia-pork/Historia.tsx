/**
 * Historia "Pork to China" (scrollytelling). Se dibuja en el servidor:
 *  - Escritorio con JS: el gráfico queda fijo a la izquierda y cambia según el paso visible (Scrolly).
 *  - Celular, sin JS o con movimiento reducido: cada paso muestra su propio gráfico debajo del texto.
 * Cada paso incluye una tabla con los datos del gráfico, solo para lectores de pantalla.
 */
import { CERTIFICACION, CIERRE, DESVIO, DISPARADORES, LANDED, MARGEN, PASOS, SALTOS, TORNADO, VAN, type Idioma } from './datos'
import { GRAFICOS, num } from './Graficos'
import { Scrolly } from './Scrolly'

function TablaDatos({ i, locale }: { i: number; locale: Idioma }) {
  const es = locale === 'es'
  const filas: [string, string][] =
    i === 0
      ? DESVIO.map((d) => [d.pais[locale], `${num(d.pp, locale, 1, true)} pp`])
      : i === 1
        ? SALTOS.map((s) => [s.evento[locale], `${num(s.valor, locale, 1, true)} pp (IC 95 %: ${num(s.bajo, locale, 1)} a ${num(s.alto, locale, 1)})`])
        : i === 2
          ? LANDED.map((l) => [
              l.pais[locale] + (l.acceso ? '' : es ? ' (sin acceso)' : ' (no access)'),
              l.max > l.min ? `${num(l.min, locale, 2)}–${num(l.max, locale, 2)} USD/kg` : `${num(l.min, locale, 2)} USD/kg`,
            ])
          : i === 3
            ? [
                [es ? 'China paga' : 'China pays', `${num(MARGEN.fob, locale, 2)} USD/kg`],
                [es ? 'Víscera en Ecuador' : 'Offal in Ecuador', `−${num(MARGEN.viscera, locale, 2)} USD/kg`],
                [es ? 'Proceso, frío y puerto' : 'Processing, cold, port', `−${num(MARGEN.costos, locale, 2)} USD/kg`],
                [es ? 'Margen' : 'Margin', `${num(MARGEN.margen, locale, 2)} USD/kg`],
              ]
            : i === 4
              ? VAN.map((f) => [f.fila[locale], f.valores.map((v, j) => `${CERTIFICACION[j][locale]}: ${num(v, locale, 2)} M`).join(' · ')])
              : TORNADO.map((t) => [t.supuesto[locale], `${num(t.conMin, locale, 2)} / ${num(t.conMax, locale, 2)} M USD`])
  return (
    <div className="sr-only">
      <table>
      <caption>{PASOS[i].titulo[locale]}</caption>
      <tbody>
        {filas.map(([a, b]) => (
          <tr key={a}>
            <th scope="row">{a}</th>
            <td>{b}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  )
}

export function HistoriaPork({ locale }: { locale: Idioma }) {
  const fijos = GRAFICOS.map((G, i) => <G key={i} locale={locale} />)
  return (
    <div className="hp">
      <Scrolly total={PASOS.length} fijos={fijos}>
        {PASOS.map((p, i) => {
          const G = GRAFICOS[i]
          return (
            <section className="hp-paso" data-paso={i} key={p.titulo.es} aria-labelledby={`hp-t-${i}`}>
              <p className="hp-num">
                {String(i + 1).padStart(2, '0')} / {String(PASOS.length).padStart(2, '0')}
              </p>
              <h3 id={`hp-t-${i}`}>{p.titulo[locale]}</h3>
              <p>{p.texto[locale]}</p>
              <div className="hp-grafico-paso">
                <G locale={locale} />
              </div>
              <TablaDatos i={i} locale={locale} />
              <p className="hp-fuente">
                {locale === 'es' ? 'Fuente: ' : 'Source: '}
                {p.fuente[locale]}
              </p>
            </section>
          )
        })}
      </Scrolly>
      <div className="hp-cierre tarjeta-base">
        <h3>{CIERRE.titulo[locale]}</h3>
        <p>{CIERRE.texto[locale]}</p>
        <ul className="hp-disparadores">
          {DISPARADORES.map((d) => (
            <li key={d.codigo} data-estado={d.cumplido}>
              <span className="hp-codigo">{d.codigo}</span>
              <span>
                <strong>{d.texto[locale]}</strong>
                <span className="hp-hoy">{d.hoy[locale]}</span>
              </span>
              <span className="hp-estado">
                {d.cumplido === 'no' ? (locale === 'es' ? 'No cumplido' : 'Not met') : locale === 'es' ? 'En camino' : 'On track'}
              </span>
            </li>
          ))}
        </ul>
        <p className="hp-fuente">{CIERRE.nota[locale]}</p>
      </div>
    </div>
  )
}
