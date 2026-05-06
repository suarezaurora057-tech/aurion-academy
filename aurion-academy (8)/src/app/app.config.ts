import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  LOCALE_ID,
} from '@angular/core';
import {provideRouter, withInMemoryScrolling} from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

import {routes} from './app.routes';

registerLocaleData(localeEs, 'es');

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })),
    { provide: LOCALE_ID, useValue: 'es' }
  ],
};
