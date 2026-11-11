import * as migration_20261111_181903_inicial from './20261111_181903_inicial';

export const migrations = [
  {
    up: migration_20261111_181903_inicial.up,
    down: migration_20261111_181903_inicial.down,
    name: '20261111_181903_inicial'
  },
];
