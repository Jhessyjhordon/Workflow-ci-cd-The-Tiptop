import { ApplicationConfig, importProvidersFrom, inject } from '@angular/core';
import { RouterModule, provideRouter, withDebugTracing } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './auth/interceptor/auth.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [ provideRouter(routes/*, withDebugTracing()*/),
    provideAnimations(),{ // On provide HTTP_INTERCEPTORS et on lui dit d'utiliser la class AuthInterceptor
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    importProvidersFrom([RouterModule.forRoot(routes), BrowserAnimationsModule, HttpClientModule]) //On importe routes, Browser et HttpClientModule qui sont nécessaire
  ],
};
