import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit  {
  loginForm!: FormGroup;
  formSubmitted: boolean = false;

  isLoggedIn: boolean = false;

  submissionResult: { success: boolean; message: string } | null = null;

  constructor(private auth: AuthService, private router: Router, private fb: FormBuilder) {
    this.loginForm = this.buildCommonForm();
  }

  ngOnInit() {
    // this.auth.isLoggedIn().subscribe((loggedIn) => {
    //   this.isLoggedIn = loggedIn; // vérifie l'etat de la connexion (true si connecté)
    //   console.log(loggedIn);
    // });
    // // si l'utilisateur est déjà connecté il a pas acces à la route "auth/login" et on le renvoie sur la "home" 
    // // si non il a l'accès
    // if (this.isLoggedIn) {
    //   this.router.navigate(['home'])
    // }
  }

  buildCommonForm(): FormGroup {
    // Définir les regex pour la validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/u;

    const authForm = this.fb.group({
      lastname: ['', [Validators.required]],
      firstname: ['', [Validators.required]],
      phone: ['', [Validators.required]],
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

      console.log("~~~~~~~>", loginData );
      

      this.auth.signup(loginData).subscribe(
        (result) => {
          this.submissionResult = {
            success: true,
            message: result.message,
          };
          this.loginForm.reset(); // Réinitialiser le formulaire après la soumission réussie
          this.router.navigate(['home'])
        },
        (err: Error) => {
          console.error("==============>>>>>>>>", err);
          this.submissionResult = {
            success: false,
            message:
              "Une erreur s'est produite lors de l'envoi du message. Veuillez réessayer plus tard.",
          };
        }
      )
    }
  }
}
