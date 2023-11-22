import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { UserAdmin } from 'src/app/models/user-admin.model';
import { AllTickets } from 'src/app/models/all-ticket.model';

@Injectable({
  providedIn: 'root'
})
export class TicketVerifyService {

  private endpointUrl = 'https://api.preprod.dsp-archiwebo22b-ji-rw-ah.fr'; // Endpoint de l'API 

  constructor(private http: HttpClient) { }

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

  patchTicketUserId(id: number, data: object): Observable<any> {
    const url = `${this.endpointUrl}/ticket/${id}`;
    return this.http.patch(url, data);
  }
}
