import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TicketVerifyService } from 'src/app/services/ticketVerify/ticket-verify.service';
import { AllBatch } from 'src/app/models/all-batch.model';

@Component({
  selector: 'app-mes-gains',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mes-gains.component.html',
  styleUrls: ['./mes-gains.component.scss']
})
export class MesGainsComponent implements OnInit {
  batch: any = [];

  constructor(private auth: AuthService, private ticketVerifyService: TicketVerifyService) { }

  ngOnInit(): void {
    this.getBatch();

    console.log("La route batch/retreive est en maintenance", this.batch);

  }

  getUserId(): string | null {
    const userId = this.auth.getIdUser();
    return userId;
  }

  // Recupérer le lot en fonction de la clé étrangère batch_id dans la table ticket
  // EN MAINTENANCE
  getBatch() {

    this.ticketVerifyService.getBatchByTicketUserId().subscribe(
      (response: any[]) => {
        console.log("Lot associé à ce user : \n", response);
        // Utilisez la méthode map pour extraire uniquement les objets batch
        this.batch = response.map(item => item.batch);
        console.log("Lot associé à ce user : \n", this.batch);
      },
      error => {
        console.error(`Le lot de l'utilisateur n\'est pas trouvé`, error);
      }
    );
  }
}
