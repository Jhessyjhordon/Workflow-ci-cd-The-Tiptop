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
      confirmPassword: ['', [Validators.required]]
    }, {
      validator: this.mustMatch('password', 'confirmPassword') // On gère ici la comparaison de pass et confirm password pour qu'ils soient à l'identique
    });

    return authForm;
  }

  // Méthode pour les champs du formulaire d'inscription s'ils sont invalides
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


    if (this.loginForm.valid) { // Si le formulaire d'inscription est valide
      this.formSubmitted = false;
      const loginData = this.loginForm.value; // On créer une constante et on ajoute les valeurs du formulaire d'inscription dedans

      console.log("~~~~~~~>", loginData );
      
      // On fait appel à la méthode signup du Service AuthService pour effectuer l'inscription
      this.auth.signup(loginData).subscribe(
        (result) => {
          this.submissionResult = {
            success: true,
            message: result.message,
          };
          this.loginForm.reset(); // Réinitialiser le formulaire après la soumission réussie
          this.router.navigate(['home']) // Redirige vers la home
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

  // Méthode qui permet de vérifier si 2 champs ont la même valeur lors de la saisie
  mustMatch(controlName: string, matchingControlName: string){
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
  
      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        // retourner si un autre validateur a déjà trouvé une erreur sur le MatchingControl
        return;
      }
  
      // définir une erreur sur matchingControl si la validation échoue
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
}
