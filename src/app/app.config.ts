import { ApplicationConfig, importProvidersFrom, inject, isDevMode } from '@angular/core';
import { RouterModule, provideRouter, withDebugTracing } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './auth/interceptor/auth.interceptor';
import { provideClientHydration } from '@angular/platform-browser';
import { provideServiceWorker } from '@angular/service-worker';


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes /*, withDebugTracing()*/),
    provideAnimations(), {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
    },
    importProvidersFrom([RouterModule.forRoot(routes), BrowserAnimationsModule, HttpClientModule]),
    provideHttpClient(),
    provideClientHydration(), provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    })],
};
