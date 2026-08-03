import {
  withNativeFederation,
  shareAll
} from '@angular-architects/native-federation/config';

/*
 * Creamos una configuración nueva para cada paquete compartido.
 *
 * includeSecondaries permite compartir también entry points internos,
 * por ejemplo partes específicas de Angular Forms, Material y CDK.
 */
const shareCompletePackage = () => ({
  singleton: true,
  strictVersion: true,
  requiredVersion: 'auto',
  build: 'package',

  includeSecondaries: {
    keepAll: true
  }
});

export default withNativeFederation({
  name: 'todos-mfe',

  exposes: {
    './Todos': './src/app/pages/todos/todos.ts'
  },

  shared: {
    ...shareAll(
      {
        singleton: true,
        strictVersion: true,
        requiredVersion: 'auto',
        build: 'package'
      },
      {
        overrides: {
          '@angular/core': shareCompletePackage(),
          '@angular/forms': shareCompletePackage(),
          '@angular/material': shareCompletePackage(),
          '@angular/cdk': shareCompletePackage()
        }
      }
    )
  },

  skip: [
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
    'rxjs/webSocket',

    '@angular/cdk/schematics',
    /^@angular\/material\/.*\/testing(?:\/.*)?$/,
    /^@angular\/cdk\/testing(?:\/.*)?$/
  ],

  features: {
    denseChunking: true
  }
});