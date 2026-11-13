import * as migration_20261111_181903_inicial from './20261111_181903_inicial';
import * as migration_20261113_182146_blob_storage from './20261113_182146_blob_storage';

export const migrations = [
  {
    up: migration_20261111_181903_inicial.up,
    down: migration_20261111_181903_inicial.down,
    name: '20261111_181903_inicial',
  },
  {
    up: migration_20261113_182146_blob_storage.up,
    down: migration_20261113_182146_blob_storage.down,
    name: '20261113_182146_blob_storage'
  },
];
