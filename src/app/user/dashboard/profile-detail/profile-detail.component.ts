import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserCustomer } from 'src/app/models/user-custumer.model';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-profile-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.scss']
})
export class ProfileDetailComponent implements OnInit {

  public userData!: UserCustomer | null;
  public informationType!: string; // on a le parametre avec sa clé et sa value
  public nouvelleAdresse: string = ''; // Initialisez cette propriété avec une chaîne vide.
  public nouveauNom: string = ''; // Initialisez cette propriété avec une chaîne vide.
  public nouveauPrenom: string = ''; // Initialisez cette propriété avec une chaîne vide.
  public password: { current: string; new: string; confirm: string; } = { current: '', new: '', confirm: '' }; // Déclarez les propriétés pour le mot de passe
  public email: string = '';
  public phone: string = '';
  public birthDate: string = '';

  // Utilisation d'ActiveRoute pour récupérer le paramètre (ici on récupère le paramètre en fonction de sa clé)
  constructor(private route: ActivatedRoute, private userService: UserService) {

  }

  ngOnInit() {
    // 
    this.route.queryParams.subscribe(params => {
      this.informationType = params['type'];
      console.log(this.informationType);

    });
    this.userService.userData$.subscribe(user => {
      this.userData = user;
      console.log("---->", this.userData);
      this.fetchInputData();
    });
    console.log("---->", this.userData);


  }

  fetchInputData() {
    if (this.userData) {
      // Ici, vous pouvez définir les valeurs par défaut en fonction du type d'information.
      switch (this.informationType) {
        case 'nom-prenom':
          this.nouveauNom = this.userData.firstname;
          this.nouveauPrenom = this.userData.lastname;
          break;
        case 'adresse':
          this.nouvelleAdresse = this.userData!.address;
          break;
        case 'email':
          this.email = this.userData!.email;
          break;
        case 'phone':
          this.phone = this.userData!.phone;
          break;
        case 'birthDate':
          /* Pour l'élément <input type="date">, le format attendu pour un champ de type "date" est "yyyy-MM-dd".
             Pour cela j'ai instacié la date de naissance du user dans new Date tout en le convertissant au format 
             ISO ce qui permet d'avoir le format "yyyy-MM-dd" 
          */
          this.birthDate = new Date(this.userData!.birthDate).toISOString().substring(0, 10);
          break;
        // Ajoutez des cas pour d'autres types d'informations si nécessaire.
      }
    }
  }

  enregistrer() {
    if (this.userData) {
      // On s'assure que les données sont valides avant de les mettre à jour.
      switch (this.informationType) {
        case 'nom-prenom':
          // Mis à jour du nom et du prénom ici.
          this.userData.firstname = this.nouveauPrenom;
          this.userData.lastname = this.nouveauNom;
          break;
        case 'adresse':
          // Mis à jour de l'adresse ici.
          this.userData.address = this.nouvelleAdresse;
          break;
        case 'email':
          this.userData!.email = this.email;
          break;
        case 'phone':
          this.userData!.phone = this.phone;
          break;
        case 'mot-de-passe':
          // Vérification du password actuel
          // bcrypt.compareSync(this.userData.password, this.password.new);
          // Vérifiez si le nouveau mot de passe et la confirmation correspondent
          if (this.password.new === this.password.confirm) {
            // const currentAndNewPassword = [this.userData.password[0], this.password.new]
            // this.userData.password = this.password.new;
            console.log('La modification du mot de passe est en cours de maintenance.');
          } else {
            // Les mots de passe ne correspondent pas, affichez un message d'erreur
            console.error('Les mots de passe ne correspondent pas.');
          }
          break;
        case 'birthDate':
          /* Pour l'élément <input type="date">, le format attendu pour un champ de type "date" est "yyyy-MM-dd".
             Pour cela j'ai instacié la date de naissance du user dans new Date tout en le convertissant au format 
             ISO ce qui permet d'avoir le format "yyyy-MM-dd" 
          */
          this.userData!.birthDate = new Date(this.birthDate).toISOString();
          break;
        // Ajoutez d'autres cas pour d'autres types d'informations si nécessaire.
      }

      // Appelez la méthode du service pour mettre à jour les données de l'utilisateur.
      this.userService.updateUserData(this.userData).subscribe(
        updatedUserData => {
          // Réponse de mise à jour reçue du service.
          console.log('Données utilisateur mises à jour :', updatedUserData);
        },
        error => {
          // Gestion des erreurs en cas d'échec de la mise à jour.
          console.error('Erreur lors de la mise à jour des données utilisateur :', error);
        }
      );
    }
  }

}
