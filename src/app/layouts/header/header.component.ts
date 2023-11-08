import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { jwtDecode } from 'jwt-decode';
import { UserCustomer } from 'src/app/models/user-custumer.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  userData!: UserCustomer | null;

  constructor(private auth: AuthService, private userService: UserService) { }

  ngOnInit(): void {
    this.auth.isLoggedIn().subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
    // this.getUserData();

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
