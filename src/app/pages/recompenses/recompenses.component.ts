import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-recompenses',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './recompenses.component.html',
  styleUrls: ['./recompenses.component.scss']
})
export class RecompensesComponent {
  isLoggedIn: boolean = false;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.isLoggedIn().subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
  }
}
