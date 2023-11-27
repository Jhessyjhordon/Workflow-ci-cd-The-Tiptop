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
  
  userData!: UserCustomer | null;

  constructor(private userService: UserService) { }

  // 
  ngOnInit() {
    this.userService.userData$.subscribe(user => {
      this.userData = user;      
    });
  }

  supprimerCompte(){
    this.userService.deleteAccount();
  }
}
