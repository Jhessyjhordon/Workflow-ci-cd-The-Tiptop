import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.cookieService.get('token'); // Utilisez le CookieService pour récupérer le token
    //const authToken = localStorage.getItem('token'); // Récupère le token qui a été généré et stocker lors de la connexion de l'user
    //console.log(authToken) // Vérification que l'interceptor récupère bien le token
    const authReq = request.clone({
      headers: request.headers.set('Authorization', 'Bearer ' + authToken), // On fait en sorte que la request header ajoute Authorization et le token
    });
    //console.log(authReq);

    return next.handle(authReq);
  }
}
