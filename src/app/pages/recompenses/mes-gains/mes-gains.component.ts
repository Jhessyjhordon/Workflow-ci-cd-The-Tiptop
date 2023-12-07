import { Component, OnInit } from '@angular/core';
import { CommonModule, PlatformLocation } from '@angular/common';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TicketVerifyService } from 'src/app/services/ticketVerify/ticket-verify.service';
import { AllBatch } from 'src/app/models/all-batch.model';
import bootstrap = require('bootstrap');
import { AllTickets } from 'src/app/models/all-ticket.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-mes-gains',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mes-gains.component.html',
  styleUrls: ['./mes-gains.component.scss']
})
export class MesGainsComponent implements OnInit {
  batch: any = [];
  tickets: any[] = [];
  latestTicketId!: number;
  public dataTicket!: any;
  selectedBatch: any;

  constructor(private auth: AuthService, private ticketVerifyService: TicketVerifyService, private router: Router, private route: ActivatedRoute, private platformLocation: PlatformLocation) {
    this.tickets = []; // Initialiser avec un tableau vide ou les données par défaut.
  }

  ngOnInit(): void {
    this.getBatch();

    console.log("La route batch/retreive est en maintenance", this.batch);

    console.log(this.tickets);

  }

  // getUserId(): string | null {
  //   const userId = this.auth.getIdUser();
  //   return userId;
  // }

  // Get and arrays of batch and tickets associate to this user
  getBatch() {
    this.ticketVerifyService.getBatchByTicketUserId().subscribe(
      (response: AllTickets[]) => {
        console.log("Lot associé à ce user : \n", response);
        // Utilisez la méthode map pour extraire uniquement les objets batch
        // Get all batch of the user
        this.batch = response.map(item => item.batch);
        // Get all ticket of the user
        this.tickets = response.map(item => item);
        console.log("Ticket associé à ce user : -----> \n", this.tickets);
        console.log("Lot associé à ce user : -----> \n", this.batch);
      },
      error => {
        console.error(`Le lot de l'utilisateur n\'est pas trouvé`, error);
      }
    );
  }

  // Open the modal and get the batchId to display the associate data in the modal
  openModalToGetBatchId(batchId: number) {
    this.selectedBatch = this.getBatchById(batchId);
    console.log(this.selectedBatch);

    const ticketId = this.getLatestTicketId(batchId);
    this.storeLatestTicketId(ticketId);

    // Récupérer l'élément modal
    // const modalElement = document.getElementById('claimModal');

    // // Vérifier si l'élément modal existe avant de créer la modale
    // if (modalElement) {
    //   const modal = new bootstrap.Modal(modalElement);
    //   modal.show();

    //   // Appel de la méthode pour récupérer et stocker l'ID du ticket
    //   const ticketId = this.getLatestTicketId(batchId);
    //   this.storeLatestTicketId(ticketId);

    //   // Renvoyer le focus à un élément spécifique (par exemple, le bouton de fermeture du navbar)
    //   const navbarCloseButton = document.getElementById('navbarCloseButton');
    //   if (navbarCloseButton) {
    //     navbarCloseButton.focus();
    //   }
    // } else {
    //   console.error('L\'élément modal avec l\'ID "claimModal" n\'a pas été trouvé.');
    // }
  }



  // Filter the batch array "this.batch" to get the associate batch data
  getBatchById(batchId: number): AllBatch | undefined {
    console.log(batchId);

    return this.batch.find((batch: { id: number; }) => batch.id === batchId);
  }

  // Get the ticket "id"
  getLatestTicketState(batchId: number): string {
    const latestTicket = this.getLatestTicketByBatchId(batchId);
    return latestTicket ? latestTicket?.state : 'No state found';
  }

  // Get the ticket "id"
  getLatestTicketId(batchId: number): number | undefined {
    const latestTicket = this.getLatestTicketByBatchId(batchId);
    return latestTicket?.id;
  }

  // Store the associate ticket "id"
  storeLatestTicketId(ticketId: number | undefined): void {
    this.latestTicketId = ticketId!;
  }


  // Get the ticket "statusGain"
  getLatestTicketStatus(batchId: number): string {
    const latestTicket = this.getLatestTicketByBatchId(batchId);
    return latestTicket ? latestTicket.statusGain : 'N/A';
  }

  // Filter the ticket array "this.tickets" to get the associate ticket data
  getLatestTicketByBatchId(batchId: number): AllTickets | undefined {
    return this.tickets
      .filter(ticket => ticket.batch && ticket.batch.id === batchId)
      .reduce((latest, current) => (latest.dateAchat > current.dateAchat ? latest : current), {});
  }




  // isNotDemanded(batchId: number): boolean {
  //   return this.getLatestTicketStatus(batchId) === 'not demanded';
  // }

  // isDemanded(batchId: number): boolean {
  //   return this.getLatestTicketStatus(batchId) === 'demanded';
  // }

  // isAssigned(batchId: number): boolean {
  //   return this.getLatestTicketStatus(batchId) === 'assigned';
  // }

  // statusMapping: { [key: string]: string } = {
  //   'not demanded': 'Non demandé',
  //   'demanded': 'A réclamer',
  //   'assigned': 'Assigné',
  // };

  // getTranslatedStatus(status: string): string {
  //   return this.statusMapping[status] || status;
  // }

  // getTicketId(ticketId: any) {
  //   console.log("=====>", ticketId);

  // }



  isUncheked(batchId: number): boolean {
    return this.getLatestTicketState(batchId) === 'unchecked';
  }

  isChecked(batchId: number): boolean {
    return this.getLatestTicketState(batchId) === 'checked';
  }

  isClaimed(batchId: number): boolean {
    return this.getLatestTicketState(batchId) === 'claimed';
  }

  isRecieved(batchId: number): boolean {
    return this.getLatestTicketState(batchId) === 'recieved';
  }


  stateMapping: { [key: string]: string } = {
    'unchecked': 'non jouer',
    'checked': 'pas encore reclamer',
    'claimed': 'gain a recuperer en magasin',
    'recieved': 'gain reçu',
  };

  getTranslatedState(state: string): string {
    return this.stateMapping[state] || state;
  }















  // Ajoutez une méthode pour réclamer les gains en utilisant l'ID du dernier ticket
  claimGains(): void {
    console.log(this.latestTicketId);

    if (this.latestTicketId) {
      // Appel de la méthode pour réclamer les gains en utilisant l'ID du dernier ticket
      this.pathTicket(this.latestTicketId);
    } else {
      console.error('ID du ticket non trouvé.');
    }
  }

  pathTicket(ticketId: number) {
    console.log("----->--->---> ", ticketId); // return undefined
    const ticketAttribue = {
      state: "claimed"
    };

    // Appel de la méthode de mise à jour partielle
    this.ticketVerifyService.patchTicketStatus(ticketId, ticketAttribue).subscribe(
      (response) => {
        console.log('Ticket mis à jour avec succès', response);
        // Naviguer à la même route pour rafraîchir la vue
        // this.router.navigate(['.'], { relativeTo: this.route });
        // window.location.reload();

        // this.router.navigateByUrl('/refresh', { skipLocationChange: true }).then(() => {
        //   this.router.navigate(['/recompenses']);
        //   const modalBackdrop = document.querySelector('.modal-backdrop');
        //   if (modalBackdrop) {
        //     modalBackdrop.classList.remove('show');
        //   }
        // });
        location.reload();

        // Actualiser la page sans ajouter l'ID du ticket à l'URL
        // this.platformLocation.onPopState(() => location.reload());
        // history.replaceState({}, document.title, location.pathname);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du ticket', error);
      }
    );
  }

}
