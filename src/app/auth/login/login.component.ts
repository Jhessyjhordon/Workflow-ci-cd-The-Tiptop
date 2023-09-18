import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(private auth: AuthService, private router: Router) { }

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  ngOnInit() {
    this.auth.isLoggedIn().subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn; // vérifie l'etat de la connexion (true si connecté)
      console.log(loggedIn);
      
    });
    // si l'utilisateur est déjà connecté il a pas acces à la route "auth/login" et on le renvoie sur la "home" 
    // si non il a l'accès
    if (this.isLoggedIn) { 
      this.router.navigate(['home'])
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.auth.login(this.loginForm.value).subscribe(
        (result) => {
          this.router.navigate(['home'])
        },
        (err: Error) => {
          alert(err.message);
        }
      )
    }
  }
}
