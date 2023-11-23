import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private endpointUrl = environment.endpointUrl; // Remplacez ceci par l'URL réelle de votre backend

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any[]> {
    // Récupérer la liste des utilisateurs depuis le backend
    const url = `${this.endpointUrl}/users`;
    return this.http.get<any[]>(url);
  }

  getBatches(): Observable<any[]> {
    // Récupérer la liste des lots depuis le backend
    const url = `${this.endpointUrl}/batches`;
    return this.http.get<any[]>(url);
  }

  createTicket(ticket: any): Observable<any> {
    // Envoyer les données du nouveau ticket au backend
    const url = `${this.endpointUrl}/tickets`;
    return this.http.post<any>(url, ticket);
  }
}
