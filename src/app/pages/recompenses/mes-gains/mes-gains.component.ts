import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth/auth.service';
import { BatchesService } from 'src/app/services/batches/batches.service';

@Component({
  selector: 'app-mes-gains',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mes-gains.component.html',
  styleUrls: ['./mes-gains.component.scss']
})
export class MesGainsComponent implements OnInit {
  allBatche: any;

  constructor(private auth: AuthService, private batchService: BatchesService) { }

  ngOnInit(): void {
    this.getBatch();

    console.log("La route batch/retreive est en maintenance");
    
  }

  getUserId(): string | null {
    const userId = this.auth.getIdUser();
    return userId;
  }

  // Recupérer le lot en fonction de la clé étrangère batch_id dans la table ticket
  // EN MAINTENANCE
  getBatch() {

    this.batchService.getBatchByUserToken().subscribe(
      (response: any) => {
        console.log("Lot associé à ce user : \n", response);
        this.allBatche = response;
      },
      error => {
        console.error(`Le lot de l'utilisateur n\'est pas trouvé`, error);
      }
    );
  }
}
