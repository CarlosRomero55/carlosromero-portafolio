# Respaldo semanal de la base

Cada lunes (03:17, hora de Guayaquil) GitHub Actions:

1. Copia la base de Neon con `pg_dump`.
2. **Comprueba la copia**: la restaura en una base vacía y cuenta proyectos, mensajes e imágenes. Si no hay proyectos, no guarda nada y la ejecución sale en rojo.
3. La **cifra** con AES-256 usando tu clave de respaldo.
4. La guarda en un repositorio **privado** aparte (`portafolio-respaldos`). Se conservan los últimos 12 (unos 3 meses).

Nunca se guarda en el repositorio público ni como *artifact*. Las imágenes subidas viven en Vercel Blob y no entran en este respaldo (sí sus datos y textos alternativos).

## Configuración (una sola vez)

1. **Repositorio privado.** GitHub → New repository → nombre `portafolio-respaldos` → **Private** → marca *Add a README file* → Create.
2. **Token solo para ese repositorio.** GitHub → Settings → Developer settings → Personal access tokens → **Fine-grained tokens** → Generate new token:
   - Nombre: `respaldo-portafolio`. Vencimiento: 1 año (anota la fecha para renovarlo).
   - Repository access: **Only select repositories** → `portafolio-respaldos`.
   - Permissions → Repository permissions → **Contents: Read and write**.
   - Copia el token (solo se muestra una vez).
3. **Clave del respaldo.** Inventa una frase larga (mínimo 20 caracteres) y guárdala en tu gestor de contraseñas. **Sin esa clave no se puede abrir ningún respaldo**, ni siquiera tú.
4. En el repositorio `carlosromero-portafolio` → Settings → Secrets and variables → Actions → **New repository secret**:
   - `RESPALDO_TOKEN` = el token del paso 2.
   - `BACKUP_PASSPHRASE` = la clave del paso 3.
   - (`DATABASE_URL` ya existe.)
5. Actions → **Respaldo semanal de la base** → Run workflow. Debe salir en verde y aparecer un archivo en `portafolio-respaldos/respaldos/`.

## Restaurar (solo si algo salió mal)

En Windows: instala [Gpg4win](https://www.gpg4win.org/) y [PostgreSQL](https://www.postgresql.org/download/windows/) (solo las herramientas de línea de comandos).

```powershell
# 1. Descifrar (pide la clave del respaldo)
gpg --output portafolio.dump --decrypt portafolio_AAAA-MM-DD_HHMM.dump.gpg

# 2. Restaurar en una base NUEVA de Neon (crea una rama o base vacía en Neon y copia su cadena de conexión directa)
pg_restore --no-owner --no-privileges --dbname "CADENA_DE_LA_BASE_NUEVA" portafolio.dump
```

Después cambia `DATABASE_URL` en Vercel a la base restaurada y vuelve a desplegar. Restaurar sobre una base nueva evita mezclar datos con la dañada.
