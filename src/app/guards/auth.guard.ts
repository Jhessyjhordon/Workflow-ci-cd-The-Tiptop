// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { Observable, map, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isLoggedIn().pipe(
      take(1), // Prend la valeur actuelle et complète l'Observable
      map((loggedIn: boolean) => {
        const userRole = this.authService.getRoleUser();

        if (!loggedIn) {
          this.router.navigate(['auth/login']);
          return false;
        }

        if (userRole === 'admin') {
          // Pas besoin de rediriger ici car si le garde passe, la navigation vers le DashboardComponent se produira automatiquement
          console.log('Je suis dedans')
          return true;
        }

        // Si l'utilisateur n'est pas admin, redirigez-le vers la page d'accueil ou n'importe quelle autre page appropriée
        this.router.navigate(['/']);
        return false;
      })
    );
  }
}

