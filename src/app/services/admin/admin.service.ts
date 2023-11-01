import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Vous récupérerez probablement votre jeton d'un service d'authentification ou du stockage local
    const authToken = this.auth.getAuthToken(); // implémentez cette méthode selon votre logique d'authentification

    // Cloner la requête pour y ajouter le jeton d'authentification
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });

    // Envoyer la requête clonée avec l'en-tête d'authentification au lieu de la requête originale
    return next.handle(authReq);
  }
  constructor() { }
}
