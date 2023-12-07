import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {GoogleLoginButtonComponent} from '../google-login-button/google-login-button.component';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, GoogleLoginButtonComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  title= 'Thé Tiptop - Grand Jeu Concours à Nice - Connexion';
  loginForm!: FormGroup;
  formSubmitted: boolean = false;

  isLoggedIn: boolean = false;

  submissionResult: { success: boolean; message: string } | null = null;

  constructor(private auth: AuthService, private router: Router, private fb: FormBuilder, private titleService : Title, private metaService: Meta) {
    this.loginForm = this.buildCommonForm();
    this.titleService.setTitle(this.title);
    this.updateTag();
  }

  // Définition des différentes balises pour le SEO
  updateTag() {
    this.metaService.updateTag({ httpEquiv: 'Content-Type', content: 'text/html' }); // Indique aux agents et serveurs de prendre le contenu de cette page en tant que HTML
    this.metaService.updateTag({ name: 'description', content: "Connectez-vous sur Thé Tiptop pour participer au concours à Nice. Vivez l'expérience unique du jeu à l'occasion des 10 ans de notre boutique de thé." }); // Meta description de la page
    this.metaService.updateTag({ property: 'og-type', content: "Site web"}); /* Indique le type de l'objet */
    this.metaService.updateTag({ name: 'robots', content: 'index,follow' }); // Permet au robot d'indexer la page
    this.metaService.updateTag({ name: 'keywords', content: 'connexion concours Nice' }); //Add keyword
    this.metaService.updateTag({ property: 'og:title', content: "Thé Tiptop - Grand Jeu Concours à Nice - Connexion" }) // Titre pour l'encadré dans les recherches
  }

  ngOnInit() {
    this.auth.isLoggedIn().subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn; // vérifie l'etat de la connexion (true si connecté)
    });
  }

  buildCommonForm(): FormGroup {
    // Définir les regex pour la validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/u;

    const authForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(emailRegex)]],
      password: ['', [Validators.required]],
    });

    return authForm;
  }

  isFieldInvalid(form: FormGroup, field: string): boolean {
    const control = form.get(field);
    return control!.invalid && (control!.touched || control!.dirty) && control!.value === false;
  }

  markFieldsAsTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control?.markAsTouched();
    });
  }

  onSubmit() {
    this.formSubmitted = true;
    this.markFieldsAsTouched(this.loginForm);


    if (this.loginForm.valid) {
      this.formSubmitted = false;
      const loginData = this.loginForm.value;

      this.auth.login(loginData).subscribe(
        (result) => {
          this.submissionResult = {
            success: true,
            message: result.message,
          };
          this.loginForm.reset(); // Réinitialiser le formulaire après la soumission réussie
          /*this.router.navigate(['home'])*/
        },
        (err: Error) => {
          console.error("==============>>>>>>>>", err);
          this.submissionResult = {
            success: false,
            message:
              "Une erreur s'est produite lors de la connexion. Veuillez réessayer plus tard.",
          };
        }
      )
    }
  }

  onCustomSignup() {
    this.auth.redirectToGoogleAuth();
  }
  
}
