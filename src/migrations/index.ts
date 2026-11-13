import * as migration_20261111_181903_inicial from './20261111_181903_inicial';
import * as migration_20261113_182146_blob_storage from './20261113_182146_blob_storage';
import * as migration_20261113_195519_caso_estudio_y_catalogo from './20261113_195519_caso_estudio_y_catalogo';

export const migrations = [
  {
    up: migration_20261111_181903_inicial.up,
    down: migration_20261111_181903_inicial.down,
    name: '20261111_181903_inicial',
  },
  {
    up: migration_20261113_182146_blob_storage.up,
    down: migration_20261113_182146_blob_storage.down,
    name: '20261113_182146_blob_storage',
  },
  {
    up: migration_20261113_195519_caso_estudio_y_catalogo.up,
    down: migration_20261113_195519_caso_estudio_y_catalogo.down,
    name: '20261113_195519_caso_estudio_y_catalogo'
  },
];
