import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketService } from 'src/app/services/ticket/ticket.service';
import { UserService } from 'src/app/services/user/user.service';
import { BatchesService } from 'src/app/services/batches/batches.service';
import { UserCustomerShortcut } from 'src/app/models/user-customer-shortcut.model';
import { ShortcutedBatch } from 'src/app/models/batch-shortcut.model';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.scss']
})

export class CreateTicketComponent implements OnInit {
  ticket: any = {}; // Créez une structure de données pour stocker les détails du ticket
  users: UserCustomerShortcut[] = []; // Créez une structure de données pour stocker les utilisateurs
  batches: ShortcutedBatch[] = []; // Créez une structure de données pour stocker les lots

  constructor(private ticketService: TicketService, 
              private userService: UserService,
              private batchService: BatchesService) { }

  ngOnInit() {
    this.loadInitialData();
  }

  loadInitialData() {
    this.userService.getShortcutCustomerDetails().subscribe(
      (users: UserCustomerShortcut[]) => {
        this.users = users;
      },
      error => {
        console.error('Erreur lors du chargement des utilisateurs :', error);
        // Gérez l'erreur selon vos besoins
      }
    );

    this.batchService.getShortcutedBatchs().subscribe(
      (batshs: ShortcutedBatch[]) => {
        this.batches = batshs;
      },
      error => {
        console.error('Erreur lors du chargement des utilisateurs :', error);
        // Gérez l'erreur selon vos besoins
      }
    );

  }

  onSubmit() {
    // Ajoutez le traitement pour envoyer le ticket au backend
    this.ticketService.createTicket(this.ticket).subscribe((response) => {
      console.log('Ticket créé avec succès:', response);
      // Ajoutez des actions supplémentaires si nécessaire
    }, (error) => {
      console.error('Erreur lors de la création du ticket:', error);
      // Gérez les erreurs ici
    });
  }
}
