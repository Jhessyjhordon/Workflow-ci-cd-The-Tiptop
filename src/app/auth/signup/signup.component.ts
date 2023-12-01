import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { GoogleLoginButtonComponent } from '../../auth/google-login-button/google-login-button.component';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, GoogleLoginButtonComponent],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  title = "S'inscrire | Thé Tiptop | Jeu concours";
  loginForm!: FormGroup;
  formSubmitted: boolean = false;
  isToastVisible: boolean = false;
  toastDisplayDuration = 30000; // 30 secondes

  progressWidth: number = 0;

  isLoggedIn: boolean = false;

  submissionResult: { success: boolean; message: string } | null = null;

  isLoggedAsAdmin: boolean = false; // True si on est connecté en tant qu'Admin

  constructor(private auth: AuthService, private router: Router, private fb: FormBuilder, private titleService: Title, private metaService: Meta) {
    this.loginForm = this.buildCommonForm();
    this.titleService.setTitle(this.title);
    this.addTag();
  }


  // Définition des différentes balises pour le SEO
  addTag() {
    this.metaService.addTag({ httpEquiv: 'Content-Type', content: 'text/html' }); // Indique aux agents et serveurs de prendre le contenu de cette page en tant que HTML
    this.metaService.addTag({ name: 'description', content: "S'inscrire à Thé Tiptop, site de jeu concours de thé pour les 10 ans et l'ouverture de la boutique à Nice" }); // Meta description de la page
    this.metaService.addTag({ property: 'og-type', content: "Site web" }); /* Indique le type de l'objet */
    this.metaService.addTag({ name: 'robots', content: 'index,follow' }); // Permet au robot d'indexer la page
    this.metaService.addTag({ name: 'keywords', content: 'inscription jeu Nice' }); //Add keyword
    this.metaService.addTag({ property: 'og:title', content: "S'inscrire | Thé Tiptop | Jeu concours" }) // Titre pour l'encadré dans les recherches
  }

  ngOnInit() {
    // console.log(this.auth.getRoleUser());
    // Vérification du role pour passer true à la variable "isLoggedAsAdmin"
    if (this.auth.getRoleUser() === "admin") {
      console.log("ok");
      this.isLoggedAsAdmin = true;
    } else console.log("not admin");
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
    const namesRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s'-]+$/u; // Pour les noms (autorise les espaces et tirets et carractère unicode)
    const phoneRegex = /^\d{10}$/; // Exemple pour un numéro de téléphone à 10 chiffres
    const passwordsRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/; // Exemple pour un mot de passe fort
    const addressRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ0-9\s,'-]+$/u; // Autorise les chiffres, lettres, carractère unicode, espaces, virgules et tirets
    // const birthDateRegex = /^\d{4}-\d{2}-\d{2}$/; // Format date "yyyy-MM-dd"
    const rolesRegex = /^(customer|employee)$/;

    const authForm = this.fb.group({
      lastname: ['', [Validators.required, Validators.pattern(namesRegex)]],
      firstname: ['', [Validators.required, Validators.pattern(namesRegex)]],
      phone: ['', [Validators.required, Validators.pattern(phoneRegex)]],
      email: ['', [Validators.required, Validators.pattern(emailRegex)]],
      password: ['', [Validators.required, Validators.pattern(passwordsRegex)]],
      confirmPassword: ['', [Validators.required, Validators.pattern(passwordsRegex)]],
      address: ['', [Validators.required, Validators.pattern(addressRegex)]],
      birthDate: ['', [Validators.required], [this.maxDateValidator()]],
      role: ['customer', [Validators.required, Validators.pattern(rolesRegex)]],
      newsletter: [0]
    }, {
      validator: this.mustMatch('password', 'confirmPassword') // On gère ici la comparaison de pass et confirm password pour qu'ils soient à l'identique
    });

    return authForm;
  }

  // Methode pour afficher  tous les champ requis lors du submis du formulaire pour éviter les oublie
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

      console.log("~~~~~~~>", loginData);

      // On fait appel à la méthode signup du Service AuthService pour effectuer l'inscription
      this.auth.signup(loginData).subscribe(
        (result) => {
          this.submissionResult = {
            success: true,
            message: "Inscription réussit ! <b>Un mail de confirmation, vous a été envoyé</b>. Veuillez confirmer votre compte pour pouvoir participer aux jeux concours !",
          };
          // Affichage du toast après les mises à jour réussies
          this.showToast();

          // Planifiez la fermeture du toast après la durée spécifiée
          setTimeout(() => {
            this.closeToast();
            this.router.navigate(['/auth/login']) // Redirige vers la home
          }, this.toastDisplayDuration);
          this.loginForm.reset(); // Réinitialiser le formulaire après la soumission réussie
        },
        (err: Error) => {
          console.error("==============>>>>>>>>", err.message);
          this.submissionResult = {
            success: false,
            message: err.message
          };
          // Affichage du toast après les mises à jour réussies
          this.showToast();
          // Planifiez la fermeture du toast après la durée spécifiée
          setTimeout(() => {
            this.closeToast();
          }, this.toastDisplayDuration);
        }
      )
    }
  }

  // Méthode pour afficher le toast
  showToast() {
    this.isToastVisible = true;
  
    // Réinitialisez la progression à 0 au début de l'affichage du toast
    this.progressWidth = 0;
  
    // Utilisez un intervalle pour augmenter progressivement la largeur de la barre de progression
    const interval = setInterval(() => {
      this.progressWidth += 1;
  
      if (this.progressWidth >= 100) {
        clearInterval(interval); // Arrêtez l'intervalle une fois que la progression atteint 100%
      }
    }, this.toastDisplayDuration / 1000); // Divisez par 100 pour obtenir des intervalles plus fréquents
  }

  closeToast(): void {
    this.isToastVisible = false;
  }

  // Méthode qui permet de vérifier si 2 champs ont la même valeur lors de la saisie
  mustMatch(controlName: string, matchingControlName: string) {
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

  onCustomSignup() {
    // Redirige l'utilisateur vers Google pour l'authentification
    this.auth.redirectToGoogleAuth();
  }

  // Fonction qui limite le choix des dates à un an avant la date actuelle pour l'affichage des dates dans l'UI du champ date
  getMaxDate(): string {
    // Obtenir la date actuelle
    const currentDate = new Date();

    // Règle : la date maximale est la date actuelle moins un an
    currentDate.setFullYear(currentDate.getFullYear() - 1);

    // Formater la date au format ISO (YYYY-MM-DD) pour l'attribut max
    const maxDate = currentDate.toISOString().split('T')[0];

    return maxDate;
  }


  // Validator qui limite le choix des dates à un an avant la date actuelle et trigger le message d'erreur en cas de date trop recent
  maxDateValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> => {
      return new Promise((resolve) => {
        const selectedDate = new Date(control.value);
        const currentDate = new Date();

        // Règle : la date maximale est la date actuelle moins un an
        currentDate.setFullYear(currentDate.getFullYear() - 1);

        // Comparer la date sélectionnée avec la date actuelle
        if (selectedDate > currentDate) {
          resolve({ 'maxDate': true });
        } else {
          resolve(null);
        }
      });
    };
  }


}
