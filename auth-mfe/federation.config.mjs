import {
  withNativeFederation,
  shareAll
} from '@angular-architects/native-federation/config';

/*
 * Debemos crear un objeto NUEVO para cada paquete.
 *
 * No reutilices la misma instancia porque Native Federation
 * completa requiredVersion: 'auto' modificando internamente
 * la configuración durante su procesamiento.
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
  name: 'auth-mfe',

  exposes: {
    './Login': './src/app/pages/login/login.ts',
    './Register': './src/app/pages/register/register.ts'
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

    /*
     * Estos entry points no son necesarios en ejecución.
     * Evitamos preparar testing y schematics para el navegador.
     */
    '@angular/cdk/schematics',
    /^@angular\/material\/.*\/testing(?:\/.*)?$/,
    /^@angular\/cdk\/testing(?:\/.*)?$/
  ],

  features: {
    denseChunking: true
  }
});