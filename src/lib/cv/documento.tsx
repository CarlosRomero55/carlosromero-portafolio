import { Document, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import type {
  CertificacionPublica,
  EtapaPublica,
  FormacionPublica,
  IdiomaPublico,
  PerfilPublico,
  ProyectoTarjeta,
} from '../data/public'

const C = { fg: '#0D1117', muted: '#57606A', brand: '#5B21B6', line: '#D0D7DE' }

const s = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10, color: C.fg, lineHeight: 1.45 },
  nombre: { fontFamily: 'Helvetica-Bold', fontSize: 22, lineHeight: 1.2, marginBottom: 4 },
  titular: { fontSize: 11, color: C.brand, marginBottom: 6 },
  contacto: { fontSize: 9, color: C.muted, marginBottom: 14 },
  h2: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: C.brand,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: C.line,
    paddingBottom: 3,
    marginTop: 14,
    marginBottom: 6,
  },
  item: { marginBottom: 6 },
  fila: { flexDirection: 'row', justifyContent: 'space-between' },
  bold: { fontFamily: 'Helvetica-Bold' },
  muted: { color: C.muted },
  hija: { marginLeft: 10, paddingLeft: 6, borderLeftWidth: 1, borderLeftColor: C.line, marginTop: 3 },
})

export type DatosCV = {
  locale: 'es' | 'en'
  textos: Record<'perfil' | 'experiencia' | 'formacion' | 'certificaciones' | 'idiomas' | 'proyectos' | 'enPreparacion', string>
  perfil: PerfilPublico
  trayectoria: EtapaPublica[]
  formacion: FormacionPublica[]
  certificaciones: CertificacionPublica[]
  idiomas: IdiomaPublico[]
  proyectos: ProyectoTarjeta[]
  urlSitio: string
}

/** D11: una sola plantilla; el idioma solo cambia los datos. */
export function DocumentoCV(d: DatosCV) {
  const p = d.perfil
  return (
    <Document title={`CV — ${p.nombrePublico}`} author={p.nombrePublico} language={d.locale}>
      <Page size="A4" style={s.page}>
        <Text style={s.nombre}>{p.nombreCompleto || p.nombrePublico}</Text>
        {p.titular ? <Text style={s.titular}>{p.titular}</Text> : null}
        <Text style={s.contacto}>
          {[p.ubicacion, d.urlSitio.replace(/^https?:\/\//, ''), p.linkedin?.replace(/^https:\/\/(www\.)?/, '')]
            .filter(Boolean)
            .join('  ·  ')}
        </Text>

        {p.presentacion ? (
          <View>
            <Text style={s.h2}>{d.textos.perfil}</Text>
            <Text>{p.presentacion}</Text>
          </View>
        ) : null}

        {d.trayectoria.length > 0 && (
          <View>
            <Text style={s.h2}>{d.textos.experiencia}</Text>
            {d.trayectoria.map((e) => (
              <View key={e.id} style={s.item} wrap={false}>
                <View style={s.fila}>
                  <Text style={s.bold}>{e.cargo}</Text>
                  {e.periodo ? <Text style={s.muted}>{e.periodo}</Text> : null}
                </View>
                <Text style={s.muted}>{e.organizacion}</Text>
                {e.descripcion
                  ? e.descripcion
                      .split('\n')
                      .map((l) => l.trim())
                      .filter(Boolean)
                      .map((l, i, todas) => <Text key={i}>{todas.length > 1 ? `• ${l}` : l}</Text>)
                  : null}
                {e.hijas.map((h) => (
                  <View key={h.id} style={s.hija}>
                    <Text>
                      <Text style={s.bold}>{h.cargo}</Text>
                      {h.organizacion ? <Text style={s.muted}>{` — ${h.organizacion}`}</Text> : null}
                      {h.periodo ? <Text style={s.muted}>{` · ${h.periodo}`}</Text> : null}
                    </Text>
                    {h.descripcion && !h.breve ? <Text>{h.descripcion}</Text> : null}
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {d.proyectos.length > 0 && (
          <View>
            <Text style={s.h2}>{d.textos.proyectos}</Text>
            {d.proyectos.map((pr) => (
              <View key={pr.id} style={s.item} wrap={false}>
                <Text style={s.bold}>{pr.titulo}</Text>
                <Text>{pr.resumen}</Text>
                {pr.tecnologias.length > 0 ? <Text style={s.muted}>{pr.tecnologias.join(' · ')}</Text> : null}
              </View>
            ))}
          </View>
        )}

        {d.formacion.length > 0 && (
          <View>
            <Text style={s.h2}>{d.textos.formacion}</Text>
            {d.formacion.map((f) => (
              <View key={f.id} style={s.item} wrap={false}>
                <View style={s.fila}>
                  <Text style={s.bold}>{f.nombre}</Text>
                  {f.anio ? <Text style={s.muted}>{f.anio}</Text> : null}
                </View>
                <Text style={s.muted}>
                  {[f.institucion, f.detalle].filter(Boolean).join(' · ')}
                </Text>
              </View>
            ))}
          </View>
        )}

        {d.certificaciones.length > 0 && (
          <View>
            <Text style={s.h2}>{d.textos.certificaciones}</Text>
            {d.certificaciones.map((c) => (
              <Text key={c.id} style={{ marginBottom: 3 }}>
                <Text style={s.bold}>{c.nombre}</Text>
                <Text style={s.muted}>
                  {` — ${c.emisor}`}
                  {c.estado === 'en_preparacion' ? ` (${d.textos.enPreparacion})` : c.anio ? ` · ${c.anio}` : ''}
                </Text>
              </Text>
            ))}
          </View>
        )}

        {d.idiomas.length > 0 && (
          <View>
            <Text style={s.h2}>{d.textos.idiomas}</Text>
            <Text>{d.idiomas.map((i) => `${i.idioma}: ${i.nivel}`).join('   ·   ')}</Text>
          </View>
        )}

        <Link src={d.urlSitio} style={{ position: 'absolute', bottom: 24, left: 40, fontSize: 8, color: C.muted }}>
          {d.urlSitio.replace(/^https?:\/\//, '')}
        </Link>
      </Page>
    </Document>
  )
}
