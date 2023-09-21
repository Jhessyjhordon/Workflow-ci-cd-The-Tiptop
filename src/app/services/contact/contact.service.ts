import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private apiUrl =
    'https://submitContactForm'; // Remplacez "votre-projet-id" par l'ID de votre projet Firebase

  constructor(private http: HttpClient) { }

  submitContactForm(formData: any) {
    console.log("data from contact service", formData);

    return this.http.post<any>(this.apiUrl, formData);
  }
}
