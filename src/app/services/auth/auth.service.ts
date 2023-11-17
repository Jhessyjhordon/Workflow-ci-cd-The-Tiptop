import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, throwError } from 'rxjs';
import { AuthResponse } from 'src/app/models/auth-response';
import { jwtDecode } from "jwt-decode";
import { CookieService } from 'ngx-cookie-service'; // Importez CookieService

interface JwtPayload { // Utilisation d'une interface Payload pour indiquer les informations qui seront stockés
  email? : string;
  role? : string;
  iat? : number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private apiUrl = 'http://api.dev.dsp-archiwebo22b-ji-rw-ah.fr';

  constructor(private router: Router, private http: HttpClient, private cookieService: CookieService) {
    // Vérifiez si un token est déjà présent lors de l'initialisation du service
    const token = this.getToken();
    //console.log('Token actuel dans le constructeur:', token);
    const isAuthenticatedValue = token !== null;
    //console.log('Valeur de isAuthenticated.next:', isAuthenticatedValue);
    this.isAuthenticated.next(isAuthenticatedValue);
  }

  setToken(token: string) {
    //localStorage.setItem('token', token); // enregistrez le jeton dans localStorage
    this.cookieService.set('token', token); // enregistrez le jeton dans localStorage
    this.isAuthenticated.next(true); // Émet un signal que l'utilisateur est maintenant authentifié
  }

  getToken(): string | null {
    const token = this.cookieService.get('token');
    //console.log('Valeur du token récupéré:', token);
    return token ? token : null; // Renvoie null si le token est une chaîne vide ou undefined
  }

  isLoggedIn() {
    return this.isAuthenticated.asObservable();
  }

  // Appelé lors de la connexion pour stocker le rôle
  setRoleUser(userRole: string) {
    //localStorage.setItem('userRole', userRole); // Stocke le rôle dans le localStorage
    this.cookieService.set('userRole', userRole); // Stocke le rôle dans le localStorage
  }

  // Méthode pour récupérer le rôle de l'utilisateur
  getRoleUser(): string | null {
    //return localStorage.getItem('userRole'); // Récupère le rôle depuis le localStorage
    return this.cookieService.get('userRole'); // Récupère le rôle depuis le localStorage
  }

  logout() {
    // localStorage.removeItem('token');
    // localStorage.removeItem('userRole');
    this.cookieService.delete('token');
    this.cookieService.delete('userRole');
    this.isAuthenticated.next(false); // Émet un signal que l'utilisateur n'est plus authentifié
    this.router.navigate(['home']);
  }

  login({ email, password }: any): Observable<any> {
    console.log('login: Attempting to log in with', email);
    const credentials = { email, password };
    console.log("user try to log with user name : ", credentials.email, " and password : ", credentials.password);

    return this.http.post<AuthResponse>(this.apiUrl  + '/user/login', credentials).pipe(
      switchMap((response) => {
        if (!response.error) {
          this.setToken(response.jwt);
          const tokenDecoded = jwtDecode<JwtPayload>(response.jwt);
          const roleUser = tokenDecoded.role as string;
          this.setRoleUser(roleUser);
  
          // Au lieu de naviguer ici, retournez un nouvel Observable qui décide où naviguer.
          return of(roleUser); // Ici, 'of' est utilisé pour transformer la valeur en Observable.
        } else {
          return throwError(() => new Error(response.message[0]));
        }
      }),
      map(roleUser => {
        if (roleUser === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else if (roleUser === 'employee')  {
          // Gérez les autres cas de rôle ici.
        } else if (roleUser === 'customer') {
          this.router.navigate(['/recompenses']);
        } else {

        }
        return roleUser; // Vous pouvez toujours renvoyer le rôle si nécessaire pour la suite du traitement.
      }),
      catchError((error) => {
        throw error;
      })
    );
  }

  // Méthode de redirection basée sur le rôle
  private redirectUserBasedOnRole(role: string): void {
    if (role === 'employee') {
      // Redirection pour les employés
      console.log('Redirigé vers employee')
    } else if (role === 'client') {
      // Redirection pour les clients
    } else {
      console.log('Redirigé vers clients')
      // Redirection par défaut
    }
  }

  //Methode pour l'inscription
  signup({ firstname, lastname, phone, email, password, address, birthDate, role }: any): Observable<any> {
    // Valeurs en dur pour birthDate, address et role
    // const birthDate = '01/01/2002';
    // const address = '2 Allée Lorentz Champs-sur-Marne';
    // const role ='customer';
    console.log("user try to signup with firstname : ", firstname, " lastname : ", lastname, " phone : ", phone, " email : ", email, " password : ", password, " address : ", address, " birthDate : ", birthDate, " and role : ", role);
    return this.http.post(this.apiUrl + '/user', {
      firstname,
      lastname,
      address,
      birthDate,
      phone,
      email,
      password,
      role
    }).pipe(
      catchError((error) => {
        if (error.status === 409) {
          // Gérez l'erreur spécifique ici, par exemple en informant l'utilisateur
          alert('Un conflit est survenu : ' + error.error.message);
        }
        // Vous pouvez aussi retransmettre l'erreur si vous voulez la gérer ailleurs
        return throwError(() => new Error('Une erreur est survenue lors de l\'inscription : ' + error.message));
      })
    );
  }
}
