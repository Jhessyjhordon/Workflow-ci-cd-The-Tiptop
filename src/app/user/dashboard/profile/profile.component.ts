import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { UserCustomer } from 'src/app/models/user-custumer.model';
import { Meta, Title } from '@angular/platform-browser';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public isToastVisible: boolean = false;
  private readonly toastDisplayDuration = 3000;
  submissionResult: { success: boolean; message: string } | null = null;
  
  userData!: UserCustomer | null;

  title= 'Mon compte | Thé Tiptop | Jeu concours';

  // Définition des différentes balises pour le SEO
  updateTag() {
   this.metaService.updateTag({ httpEquiv: 'Content-Type', content: 'text/html' }); // Indique aux agents et serveurs de prendre le contenu de cette page en tant que HTML
   this.metaService.updateTag({ property: 'og-type', content: "Site web"}); /* Indique le type de l'objet */
   this.metaService.updateTag({ name: 'robots', content: 'noindex, nofollow' }); // Permet au robot d'indexer la page
   this.metaService.updateTag({ property: 'og:title', content: "Mon compte | Thé Tiptop | Jeu concours" }) // Titre pour l'encadré dans les recherches
 }

  constructor(private userService: UserService, private titleService : Title, private metaService: Meta) {
    this.titleService.setTitle(this.title);
    this.updateTag();
   }

  // 
  ngOnInit() {
    this.userService.userData$.subscribe(user => {
      this.userData = user;      
    });
  }

  showToast() {
    this.isToastVisible = true;
  }

  closeToast(): void {
    this.isToastVisible = false;
  }

  displayeToaster(state:boolean, messageToDisplay:string){

    this.submissionResult = {
      success: state,
      message: messageToDisplay
    };
    this.showToast();
    setTimeout(() => {
        this.closeToast();
    }, this.toastDisplayDuration);

  }

  supprimerCompte() {
    this.userService.deleteAccount().subscribe(
      () => {
        this.displayeToaster(true, "Compte supprimé avec succès")
      },
      (error) => {
        this.displayeToaster(false, "Erreur lors de la suppression du compte")
        console.log(error)
      }
    );
  }
}
