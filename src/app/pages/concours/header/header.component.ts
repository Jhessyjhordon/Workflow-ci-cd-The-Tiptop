import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as bootstrap from 'bootstrap';
import { TicketVerifyService } from 'src/app/services/ticketVerify/ticket-verify.service';
import { Ticket } from 'src/app/models/ticket.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { BatchesService } from 'src/app/services/batches/batches.service';
import { RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  isVerify: boolean = false;
  token = this.cookieService.get('token');
  
  verifyTicketForm!: FormGroup;
  formSubmitted: boolean = false;
  submissionResult: { success: boolean; message: string } | null = null;
  activeSlideIndex = 0; // Index du slide actif
  // Dans votre composant
  public isToastVisible: boolean = false;
  // La durée d'affichage du toast en millisecondes
  private readonly toastDisplayDuration = 5000; // 5 secondes


  slides = [
    {
      imageSrc: '/assets/images/auth/auth_register.png',
      label: 'First slide label',
      content: 'Some representative placeholder content for the first slide.'
    },
    {
      imageSrc: '/assets/images/concours/header/cafe1.png',
      label: 'Second slide label',
      content: 'Some representative placeholder content for the second slide.'
    },
    {
      imageSrc: '/assets/images/concours/header/cafe2.png',
      label: 'Third slide label',
      content: 'Some representative placeholder content for the third slide.'
    },
    {
      imageSrc: '/assets/images/concours/header/cafe1.png',
      label: 'Fourth slide label',
      content: 'Some representative placeholder content for the fourth slide.'
    },
    // Ajoutez d'autres objets pour chaque slide ici
  ];

  constructor(private ticketVerify: TicketVerifyService, private auth: AuthService, private batchService: BatchesService, private fb: FormBuilder, private cookieService: CookieService) {
    this.verifyTicketForm = this.buildCommonForm();
  }

  ngOnInit(): void {
    // Votre code d'initialisation ici (peut être vide si vous n'en avez pas besoin)
    
    if (this.token){
      console.log("Afficher userdId", this.getUserId());
      const userId = this.getUserId();
      if (userId){
        // Appeler getUserById pour vérifier si le compte est vérifié
        this.auth.getUserById(userId).subscribe(isVerify => {
          console.log('Vérification de isVerify:', isVerify);
          this.isVerify = isVerify; // Convertit 1 en true, 0 en false
          if (this.isVerify) {
            console.log("Compte vérifié")
          } else {
            console.log("Compte non vérifié")
          }
        });
      }
    }


    this.auth.isLoggedIn().subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
    this.auth.handleAuthentication();

  }


  buildCommonForm(): FormGroup {
    // Définir les regex pour la validation
    const numTicketRegex = /^(1000|[1-9]\d{3})$/u;

    const verifyTicketFormBuilder = this.fb.group({
      numTicket: ['', [Validators.required, Validators.pattern(numTicketRegex)]]
    });

    return verifyTicketFormBuilder;
  }

  getTicketById() {
    this.formSubmitted = true;

    if (this.verifyTicketForm.valid) {
      this.formSubmitted = false;
      // const numTicket = this.verifyTicketForm.value as number;
      // Accéder directement à la propriété du formulaire et convertir en nombre.
      // L'opérateur + est utilisé pour effectuer la conversion en nombre.
      // l'autre alternative serai : const numTicket = parseInt(this.verifyTicketForm.get('numTicket').value, 10);
      const numTicket = +this.verifyTicketForm.get('numTicket')!.value;

      console.log(numTicket);


      this.ticketVerify.verifyTicket(numTicket).subscribe(
        (response: Ticket) => {
          console.log(response);
          if (response.message[0] === "Détail du ticket trouvé") {
            const idTicket = response.data.ticket.id;
            // const idBatch = response.data.ticket.batch.id;

            // Réinitialiser l'état de soumission pour vider l'input
            this.formSubmitted = false;
            // Afficher le toast (petite notification) en cas de success
            this.submissionResult = {
              success: true,
              message: "Félicitation ! Vous venez de gagné un Infuseur à thé. <br> Veillez vous rendre à la page <b>Récompence</b> pour réclamer votre gain"
              // message: response.message[0],
            };

            // Appel aux méthodes pour mettre à jour le ticket et la batch
            this.updateTicketById(idTicket);
            // this.getBatchByTicketBatchId(idBatch);
            // this.updateBatchIdByTicketBatchId(idBatch);

            // Affichage du toast après les mises à jour réussies
            this.showToast();

            // Planifiez la fermeture du toast après la durée spécifiée
            setTimeout(() => {
              this.closeToast();
            }, this.toastDisplayDuration);
          }
        },
        error => {
          console.error('Error ticket :', error);
        }
      )
    }
  }

  // Méthode pour afficher le toast
  showToast() {
    this.isToastVisible = true;
  }

  closeToast(): void {
    this.isToastVisible = false;
  }

  getUserId(): string | null {
    const userId = this.auth.getIdUser();
    return userId;
  }

  // mise a jour du ticket avec l'id du ticket connecté
  private updateTicketById(idTicket: number): void {

    const userId = this.getUserId(); // Recupère l'id de l'utilisateur connecté
    const state = "checked";
    const status_gain = "demanded";

    if (userId) {
      this.ticketVerify.patchTicket(idTicket, { user_id: userId, state: state, statusGain: status_gain }).subscribe(
        (response: any) => {
          console.log(`Mise à jour du champ user_id pour le ticket ${idTicket}`, response);
        },
        error => {
          console.error(`Erreur lors de la mise à jour de la table du ticket pour le ticket ${idTicket}`, error);
        }
      );
    }
  }

  // Mise a jour du lot en fonction de la clé étrangère batch_id
  // private updateBatchIdByTicketBatchId(batch_id: number): void {

  //   const userId = this.getUserId();
  //   const state = "checked";

  //   if (batch_id) {
  //     this.batchService.patchBatchById(batch_id, { user_id: userId, state: state }).subscribe(
  //       (response: any) => {
  //         console.log(`Mise à jour des champ user_id et state pour le lot ${batch_id}`, response);
  //       },
  //       error => {
  //         console.error(`Erreur lors de la mise à jour de la table du lot pour le lot ${batch_id}`, error);
  //       }
  //     );
  //   }
  // }

  // Recupérer le lot en fonction de la clé étrangère batch_id dans la table ticket
  // getBatchByTicketBatchId(batch_id: number) {
  //   const batchId = batch_id;

  //   if (batchId) {
  //     this.batchService.getBatcheById(batchId).subscribe(
  //       (response: any) => {
  //         console.log("Lot associé à ce ticket : \n",response);

  //       },
  //       error => {
  //         console.error(`Le lot ${batchId} n\'est pas trouvé`, error);
  //       }
  //     );
  //   }
  // }


}
