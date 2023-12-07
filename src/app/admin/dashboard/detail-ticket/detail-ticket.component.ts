import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { AllTickets } from 'src/app/models/all-ticket.model';
import { AdminService } from 'src/app/services/admin/admin.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-detail-ticket',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './detail-ticket.component.html',
  styleUrls: ['./detail-ticket.component.scss']
})
export class DetailTicketComponent implements OnInit {
  title= 'Détails tickets - Dashboard | Thé Tiptop | Jeu concours';

  public numTicket!: string;
  public dataTicket!: any;

  isToastVisible: boolean = false;
  toastDisplayDuration = 3000; // 3 secondes
  timeoutId: any; // Déclaration de la propriété timeoutId
  progressWidth: number = 0;


  // Utilisation d'ActiveRoute pour récupérer le paramètre (ici on récupère le paramètre en fonction de sa clé)
  constructor(private route: ActivatedRoute, private adminService: AdminService, private titleService : Title, private metaService: Meta, private router: Router) {
    this.titleService.setTitle(this.title);
    this.updateTag();
  }

  // Définition des différentes balises pour le SEO
  updateTag() {
    this.metaService.updateTag({ httpEquiv: 'Content-Type', content: 'text/html' }); // Indique aux agents et serveurs de prendre le contenu de cette page en tant que HTML
    this.metaService.updateTag({ property: 'og-type', content: "Site web"}); /* Indique le type de l'objet */
    this.metaService.updateTag({ name: 'robots', content: 'noindex, nofollow' }); // Permet au robot d'indexer la page
  }


  ngOnInit() {
    const ticketId = this.route.snapshot.paramMap.get('id');

    if (ticketId !== null) {
      this.numTicket = ticketId;
      // Faites quelque chose avec this.numTicket
    }

    console.log(this.numTicket);

    this.adminService.getTicketDetails(this.numTicket).subscribe(
      (response: any) => {
        const { id, numTicket, montantAchat, dateAchat, statusGain, state, user, batch } = response.data.ticket;
        
        console.log(response);
        
        console.log(response);
        
        if (id !== null) {
          this.dataTicket = {
            id,
            numTicket,
            montantAchat,
            dateAchat,
            statusGain,
            state,
            user: {
              firstname: user.firstname,
              lastname: user.lastname,
              email: user.email,
              address: user.address
            },
            batch: {
              id: batch.id,
              type_lot: batch.type_lot,
              valeur: batch.valeur,
              description: batch.description
            }
          };
  
          console.log(this.dataTicket);
        }
      },
      error => {
        console.error('Error ticket :', error);
      }
    )

    console.log(this.dataTicket); // return undefined

  }


  pathTicket() {
    console.log(this.dataTicket.id); // return undefined
    const ticketAttribue = {
      statusGain: "assigned",
      state: "recieved",
      gainAttribue: true
    };

    // Appel de la méthode de mise à jour partielle
    this.adminService.patchTicketStatus(this.dataTicket.id, ticketAttribue).subscribe(
      (response) => {
        console.log('Ticket mis à jour avec succès', response);
        this.showToast(); // Afficher le toast avant la redirection
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du ticket', error);
      }
    );
  }

  // Méthode pour afficher le toast et programmer la redirection après la fermeture du toast
  showToast() {
    this.isToastVisible = true;
    this.progressWidth = 0;

    const intervalDuration = this.toastDisplayDuration / 100; // Durée pour que la barre de progression atteigne 100%
    const interval = setInterval(() => {
      // Augmenter la largeur de la barre de progression
      this.progressWidth += 100 / (this.toastDisplayDuration / intervalDuration);

      if (this.progressWidth >= 100) {
        clearInterval(interval);
        this.isToastVisible = false; // Fermer le toast
        this.scheduleRedirection(this.dataTicket.numTicket); // Planifier la redirection après la fermeture du toast
      }
    }, intervalDuration);
  }

  // Méthode pour planifier la redirection
  scheduleRedirection(ticketId: number) {
    setTimeout(() => {
      this.reloadComponent(ticketId);
    }, 3000); // Vous pouvez ajuster ce délai si nécessaire
  }

  // Méthode pour recharger le composant
  reloadComponent(ticketId: number) {
    this.router.navigateByUrl('/refresh', { skipLocationChange: true }).then(() => {
      this.router.navigate(['admin/dashboard/detail-ticket', ticketId]);
    });
  }

  closeToast(): void {
    this.isToastVisible = false;
  }

}
