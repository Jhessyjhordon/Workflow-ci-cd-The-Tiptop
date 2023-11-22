import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { UserAdmin } from 'src/app/models/user-admin.model';
import { AllTickets } from 'src/app/models/all-ticket.model';
import { CookieService } from 'ngx-cookie-service'; // Importez CookieService
import { emailing } from 'src/app/models/emailing.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private endpointUrl = 'https://api.preprod.dsp-archiwebo22b-ji-rw-ah.fr/'; // Endpoint de l'API 

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  getUsersWithRoleClient(): Observable<UserAdmin[]> {
    // HttpClient assume par défaut que la réponse est un JSON, donc pas besoin de .json()
    return this.http.get<{ users: UserAdmin[] }>(this.endpointUrl + '/user/role/customer').pipe(
      map(response => response.users) // Assurez-vous que cela renvoie un tableau
    );
  }

  synchronizeMailchimpManually(): Observable<any> {
    return this.http.get(this.endpointUrl + '/user/email/newsletter?newsletter=1&mode=mailchimp')
  }

  deleteUserById(id: number) {
    // const token = localStorage.getItem('token');
    const token = this.cookieService.get('token');
    const url = `${this.endpointUrl}/user/${id}`;

    // Objet d'options avec le header Authorization
    const options = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    return this.http.delete(url, options).pipe(
      catchError((error: any) => {
        console.error('Error deleting user:', error);
        // Vous pouvez effectuer un traitement supplémentaire ici, si nécessaire
        return throwError('Une erreur est survenue lors de la suppression de l\'utilisateur.');
      })
    );
  }

  getAllTickets(): Observable<AllTickets[]> {
    return this.http.get<{ tickets: AllTickets[] }>(this.endpointUrl + '/ticket/').pipe(
      map(response => response.tickets)
    );
  }
  getTicketDetails(numTicket: string): Observable<any> {

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

  patchTicketStatus(id: number, data: object): Observable<any> {
    const url = `${this.endpointUrl}/ticket/${id}`;
    return this.http.patch(url, data);
  }
}
