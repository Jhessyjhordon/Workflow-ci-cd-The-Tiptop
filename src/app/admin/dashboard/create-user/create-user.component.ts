import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Meta, Title } from '@angular/platform-browser';


@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

  title= "S'inscrire | Thé Tiptop | Jeu concours";
  loginForm!: FormGroup;
  formSubmitted: boolean = false;

  isLoggedIn: boolean = false;

  submissionResult: { success: boolean; message: string } | null = null;

  isLoggedAsAdmin: boolean = false; // True si on est connecté en tant qu'Admin

  constructor(private auth: AuthService, private router: Router, private fb: FormBuilder, private titleService : Title, private metaService: Meta) {
    this.loginForm = this.buildCommonForm();
    this.titleService.setTitle(this.title);
    this.addTag();
  }


  // Définition des différentes balises pour le SEO
  addTag() {
    this.metaService.addTag({ httpEquiv: 'Content-Type', content: 'text/html' }); // Indique aux agents et serveurs de prendre le contenu de cette page en tant que HTML
    this.metaService.addTag({ name: 'description', content: "S'inscrire à Thé Tiptop, site de jeu concours de thé pour les 10 ans et l'ouverture de la boutique à Nice" }); // Meta description de la page
    this.metaService.addTag({ property: 'og-type', content: "Site web"}); /* Indique le type de l'objet */
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
      birthDate: ['', [Validators.required]],
      role: ['customer', [Validators.required, Validators.pattern(rolesRegex)]],
      newsletter: [0] 
    }, {
      validator: this.mustMatch('password', 'confirmPassword') // On gère ici la comparaison de pass et confirm password pour qu'ils soient à l'identique
    });

    return authForm;
  }

  // Méthode pour les champs du formulaire d'inscription s'ils sont invalides
  // isFieldInvalid(form: FormGroup, field: string): boolean {
  //   const control = form.get(field);
  //   return control!.invalid && (control!.touched || control!.dirty) && control!.value === false;
  // }

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
