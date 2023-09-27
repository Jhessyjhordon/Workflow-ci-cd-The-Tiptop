import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private apiUrl = 'https://submitContactForm'; // Remplacez "votre-projet-id" par l'ID de votre projet Firebase
  private sendEmailUrl = "http://localhost:3000/submit-contact-form"

  constructor(private http: HttpClient) { }

  submitContactForm(formData: any) {
    console.log("data from contact service", formData);

    return this.http.post<any>(this.apiUrl, formData);
  }

  sendContactEmail(formData: any) {
    console.log("data from contact service", formData);
    // Envoi de l'e-mail
    return this.http.post<any>(this.sendEmailUrl, formData);
  }
}
