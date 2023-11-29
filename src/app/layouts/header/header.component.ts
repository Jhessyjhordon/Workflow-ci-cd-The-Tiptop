import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { jwtDecode } from 'jwt-decode';
import { UserCustomer } from 'src/app/models/user-custumer.model';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  isLoggedAsAdmin: boolean = false;
  isLoggedAsEmploye: boolean = false;
  userData!: UserCustomer | null;
  token = this.cookieService.get('token');

  constructor(private auth: AuthService, private userService: UserService, private router: Router, private cookieService: CookieService) { }

  ngOnInit(): void {
    this.auth.isLoggedIn().subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
    // console.log(this.auth.getRoleUser());
    if (this.auth.getRoleUser() === "admin") {
      this.isLoggedAsAdmin = true;
    } else if (this.auth.getRoleUser() === "employee") {
      this.isLoggedAsEmploye = true;
    }

    // this.getUserData();
    // N'exécute les méthodes de userService s'il y a un token
    if (this.token){
      // Récupérez les données de l'utilisateur en utilisant le service
      this.userService.userData$.subscribe(user => {
        const userData = user;
        if (userData) {
          this.userData = userData;
        } else {
          // Si les données ne sont pas déjà stockées, appelez votre méthode pour les obtenir
          this.fetchUserData();
        }
      });
    }


    // Permet de remonté tout en haut de la page quand on clique sur un lien du menu
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scroll(0, 0); // Positionnement instantané en haut de la page
      }
    });

  }

  fetchUserData() {
    // Appelez la méthode pour obtenir l'ID de l'utilisateur depuis le token.
    const userId = this.userService.getUserIdFromToken();

    if (userId !== null) {
      // Appelez le service pour récupérer les données de l'utilisateur ayant cet ID.
      this.userService.getUserById(userId).subscribe(
        (userData: UserCustomer) => {
          if (userData) {
            // Mettre à jour les données de l'utilisateur dans le service
            this.userService.setUserData(userData);
            // récupérer les données qui ont été mis a jour dans le service
            // this.userData = this.userService.getUserData();
            this.userService.userData$.subscribe(user => {
              this.userData = user;
            });
            // console.log("Données utilisateur :", this.userData);
          } else {
            console.error('Les données de l\'utilisateur sont vides ou non définies.');
          }
        },
        (error) => {
          console.error('Erreur lors de la récupération des données de l\'utilisateur :', error);
        }
      );
    } else {
      console.error('ID de l\'utilisateur non disponible');
      // Gérez le cas où l'ID de l'utilisateur n'est pas disponible (par exemple, si l'utilisateur n'est pas connecté).
    }
  }


  logout() {
    this.auth.logout();
  }
}
