import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { UserCustomer } from 'src/app/models/user-custumer.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  
  userData!: UserCustomer | null;

  constructor(private userService: UserService, private toastr: ToastrService) { }

  // 
  ngOnInit() {
    this.userService.userData$.subscribe(user => {
      this.userData = user;      
    });
  }

  supprimerCompte() {
    this.userService.deleteAccount().subscribe(
      () => {
        // Gérer le succès ici (par exemple, afficher un toast)
        this.toastr.success('Compte supprimé avec succès', 'Succès');
        // Rediriger ou effectuer d'autres actions nécessaires
      },
      (error) => {
        // Gérer les erreurs ici (par exemple, afficher un toast d'erreur)
        this.toastr.error('Erreur lors de la suppression du compte', 'Erreur');
        console.error(error);
      }
    );
  }
}
