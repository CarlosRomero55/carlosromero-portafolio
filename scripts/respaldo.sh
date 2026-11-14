#!/usr/bin/env bash
# Respaldo cifrado de la base del portafolio.
#
#   1. pg_dump de DATABASE_URL (conexión directa: en Neon se quita "-pooler" del host).
#   2. Comprueba la copia restaurándola en PRUEBA_URL (una base vacía) y contando registros.
#   3. Cifra con GPG (AES-256) usando BACKUP_PASSPHRASE y borra la copia sin cifrar.
#
# Variables: DATABASE_URL, PRUEBA_URL, BACKUP_PASSPHRASE. Salida: ruta del archivo .dump.gpg
# Nunca imprime la cadena de conexión ni la clave.
set -euo pipefail

: "${DATABASE_URL:?Falta DATABASE_URL}"
: "${PRUEBA_URL:?Falta PRUEBA_URL (base vacía para comprobar la copia)}"
: "${BACKUP_PASSPHRASE:?Falta BACKUP_PASSPHRASE}"
if [ "${#BACKUP_PASSPHRASE}" -lt 20 ]; then
  echo "La clave del respaldo debe tener al menos 20 caracteres." >&2
  exit 1
fi

DIRECTA="${DATABASE_URL/-pooler./.}"
[ -n "${GITHUB_ACTIONS:-}" ] && echo "::add-mask::$DIRECTA"

TRABAJO="$(mktemp -d)"
trap 'rm -rf "$TRABAJO"' EXIT
FECHA="$(date -u +%Y-%m-%d_%H%M)"
COPIA="$TRABAJO/portafolio_$FECHA.dump"
SALIDA="${SALIDA_DIR:-.}/portafolio_$FECHA.dump.gpg"

echo "1/3 Copiando la base…" >&2
pg_dump "$DIRECTA" --format=custom --no-owner --no-privileges --file="$COPIA" 2>"$TRABAJO/err" || {
  sed 's#postgres[a-z]*://[^ ]*#[conexión oculta]#g' "$TRABAJO/err" >&2
  exit 1
}

echo "2/3 Comprobando que la copia se puede restaurar…" >&2
pg_restore --no-owner --no-privileges --exit-on-error --dbname="$PRUEBA_URL" "$COPIA" >&2
CONTEO="$(psql "$PRUEBA_URL" -At -c "select (select count(*) from proyectos)||' proyectos, '||(select count(*) from mensajes)||' mensajes, '||(select count(*) from media)||' imágenes'")"
PROYECTOS="${CONTEO%% *}"
if [ "${PROYECTOS:-0}" -lt 1 ]; then
  echo "La copia restaurada no tiene proyectos: algo salió mal, no se guarda." >&2
  exit 1
fi
echo "   Restaurada bien: $CONTEO" >&2

echo "3/3 Cifrando…" >&2
printf '%s' "$BACKUP_PASSPHRASE" | gpg --batch --yes --quiet --pinentry-mode loopback --passphrase-fd 0 \
  --symmetric --cipher-algo AES256 --output "$SALIDA" "$COPIA"
echo "$CONTEO" > "${SALIDA%.gpg}.txt"
echo "$SALIDA"
