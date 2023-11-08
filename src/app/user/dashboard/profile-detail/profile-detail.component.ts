import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.scss']
})
export class ProfileDetailComponent {

  public informationType!: string;
  nouvelleAdresse: string = ''; // Initialisez cette propriété avec une chaîne vide.
  nouveauNom: string = ''; // Initialisez cette propriété avec une chaîne vide.
  nouveauPrenom: string = ''; // Initialisez cette propriété avec une chaîne vide.
  password: { current: string; new: string; confirm: string; } = { current: '', new: '', confirm: '' }; // Déclarez les propriétés pour le mot de passe
  email: string = '';
  phone: string = '';
  birthDate: string = '';

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.informationType = params['type'];
    });
  }

  enregistrer() {
    if (this.informationType === 'nom') {
      // Traitement pour enregistrer le nouveau nom (this.nouveauNom)
    } else if (this.informationType === 'adresse') {
      // Traitement pour enregistrer la nouvelle adresse (this.nouvelleAdresse)
    }
  }

}
