import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { AllBatch } from 'src/app/models/all-batch.model';

@Injectable({
  providedIn: 'root'
})
export class TicketVerifyService {

  private endpointUrl = environment.endpointUrl; // Endpoint de l'API 

  constructor(private http: HttpClient, private authService: AuthService) { }

  verifyTicket(numTicket: number): Observable<any> {
    console.log(numTicket);
    return this.http.post(this.endpointUrl + '/ticket/verify/', { numTicket })
      .pipe(
        catchError((error) => {
          if (error.status === 409) {
            // Gérez l'erreur spécifique ici, par exemple en informant l'utilisateur
            console.error('Un conflit est survenu : ' + error.error.message);
          }
          // Vous pouvez aussi retransmettre l'erreur si vous voulez la gérer ailleurs
          return throwError(() => new Error('Une erreur est survenue lors de l\'inscription : ' + error.message));
        })
      );
  }

  patchTicket(id: number, data: object): Observable<any> {
    const url = `${this.endpointUrl}/ticket/${id}`;
    return this.http.patch(url, data);
  }
 
  // récupère le lot en fonction de l'ID du user connecté
  getBatchByTicketUserId(): Observable<any> {
    const url = `${this.endpointUrl}/ticket/byuserid`;

    // Obtenez le uderId à partir de votre service d'authentification
    const userId = this.authService.getIdUser();

    return this.http.post<{ data: AllBatch  }>(url, { userId })
      .pipe(
        map(response => response.data),
        catchError(error => {
          console.error('Une erreur s\'est produite lors de la récupération des données du lot:', error);
          return throwError(error);
        })
      );
  }
}
