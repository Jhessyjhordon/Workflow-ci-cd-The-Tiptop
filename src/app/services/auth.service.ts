import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private router: Router) {
    // Vérifiez si un token est déjà présent lors de l'initialisation du service
    this.isAuthenticated.next(this.getToken() !== null);
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
    this.isAuthenticated.next(true); // Émet un signal que l'utilisateur est maintenant authentifié
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn() {
    return this.isAuthenticated.asObservable();
  }

  logout() {
    localStorage.removeItem('token');
    this.isAuthenticated.next(false); // Émet un signal que l'utilisateur n'est plus authentifié
    this.router.navigate(['home']);
  }

  login({ email, password }: any): Observable<any> {
    console.log("user try to log with user name : ", email, " and password : ", password);
    
    if (email === 'toto@gmail.com' && password === 'toto123') {
      this.setToken('sdr-è_ujhbtyhubjgd"eYT_"ehbbcfjx');
      return of({ name: 'Toto Dupond', email: 'toto@gmail.com' });
    }
    return throwError(new Error('Failed to login'));
  }

  signup({ firstname, lastname, phone, email, password }: any): Observable<any> {
    console.log("user try to signup with firstname : ", firstname, " lastname : ", lastname, " phone : ", phone, " email : ", email, " and password : ", password);
    
    return throwError(new Error('Failed to signup'));
  }
}
