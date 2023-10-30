import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, map, of, throwError } from 'rxjs';
import { AuthResponse } from 'src/app/models/auth-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private apiUrl = 'http://api.dev.dsp-archiwebo22b-ji-rw-ah.fr/user/login';

  constructor(private router: Router, private http: HttpClient) {
    // Vérifiez si un token est déjà présent lors de l'initialisation du service
    this.isAuthenticated.next(this.getToken() !== null);
  }

  setToken(token: string) {
    localStorage.setItem('token', token); // enregistrez le jeton dans localStorage
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
    const credentials = { email, password };
    console.log("user try to log with user name : ", credentials.email, " and password : ", credentials.password);

    return this.http.post<AuthResponse>(this.apiUrl, credentials).pipe(
      map((response) => {
        if (!response.error) {
          // Si l'authentification réussit, enregistrez le jeton avec notre méthode setToken
          this.setToken(response.jwt);
          return response.message[0];
        } else {
          throw new Error(response.message[0]);
        }
      }),
      catchError((error) => {
        throw error;
      })
    );


  }

  signup({ firstname, lastname, phone, email, password }: any): Observable<any> {
    console.log("user try to signup with firstname : ", firstname, " lastname : ", lastname, " phone : ", phone, " email : ", email, " and password : ", password);

    return throwError(new Error('Failed to signup'));
  }
}
