import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { AllTickets } from 'src/app/models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private endpointUrl = 'http://api.dev.dsp-archiwebo22b-ji-rw-ah.fr'; // Endpoint de l'API 
  constructor(private http: HttpClient) {}

  getUsersWithRoleClient(): Observable<User[]> {
    // HttpClient assume par défaut que la réponse est un JSON, donc pas besoin de .json()
    return this.http.get<{ users: User[] }>(this.endpointUrl + '/user/role/client').pipe(
      map(response => response.users) // Assurez-vous que cela renvoie un tableau
    );;
  }

  getAllTickets(): Observable<AllTickets[]>{
    return this.http.get<{ tickets: AllTickets[]}>(this.endpointUrl + '/ticket/').pipe(
      map(response => response.tickets)
    );;
  }
}
