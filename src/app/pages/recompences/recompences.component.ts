import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-recompences',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recompences.component.html',
  styleUrls: ['./recompences.component.scss']
})
export class RecompencesComponent {
  isLoggedIn: boolean = false;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.isLoggedIn().subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
  }
}
