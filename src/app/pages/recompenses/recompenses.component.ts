import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { HeaderComponent } from './header/header.component';
import { MesGainsComponent } from './mes-gains/mes-gains.component';
import { GainsPotentielsComponent } from './gains-potentiels/gains-potentiels.component';

@Component({
  selector: 'app-recompenses',
  standalone: true,
  imports: [CommonModule, HeaderComponent, MesGainsComponent, GainsPotentielsComponent],
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
