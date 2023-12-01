import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TicketCreation } from 'src/app/models/ticket-creation.model';
// import { UserService } from 'src/app/services/user/user.service';
// import { UserCustomerShortcut } from 'src/app/models/user-customer-shortcut.model';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private endpointUrl = environment.endpointUrl; // Remplacez ceci par l'URL réelle de votre backend

  constructor(private http: HttpClient) { }


  createTicket(ticket: any): Observable<any> {
    // Envoyer les données du nouveau ticket au backend
    const url = `${this.endpointUrl}/ticket`;
    return this.http.post<any>(url, ticket).pipe(
      catchError((error) => {
        if (error.status === 409) {
          // Gérez l'erreur spécifique ici, par exemple en informant l'utilisateur
          alert('Un conflit est survenu : ' + error.error.message);
        }
        // Vous pouvez aussi retransmettre l'erreur si vous voulez la gérer ailleurs
        return throwError(() => new Error('Une erreur est survenue lors de la creation du tocket : ' + error.message));
      })
    );
  }
}
