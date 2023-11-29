import { Component, OnInit } from '@angular/core';
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

  public isToastVisible: boolean = false;
  private readonly toastDisplayDuration = 3000;
  submissionResult: { success: boolean; message: string } | null = null;
  
  userData!: UserCustomer | null;

  constructor(private userService: UserService) { }

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
