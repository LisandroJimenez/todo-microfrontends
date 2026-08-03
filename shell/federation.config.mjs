import {
  withNativeFederation,
  shareAll
} from '@angular-architects/native-federation/config';

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
  name: 'shell',

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