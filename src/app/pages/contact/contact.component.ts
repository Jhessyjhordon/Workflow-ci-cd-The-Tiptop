import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ContactService } from 'src/app/services/contact/contact.service';
import { RouterModule } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  title= 'Thé Tiptop - Grand Jeu Concours à Nice - Contactez-nous';
  contactForm!: FormGroup;
  formSubmitted: boolean = false;

  submissionResult: { success: boolean; message: string } | null = null;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private titleService : Title, private metaService: Meta
  ) {
    // Supprimer les metatags existants
    this.metaService.removeTag("name='description'");
    this.metaService.removeTag("name='keywords'");
    this.metaService.removeTag("property='og:title'");
    this.metaService.removeTag("name='robots'");
    this.contactForm = this.buildCommonForm();
    this.titleService.setTitle(this.title);
    this.addTag();
  }

  ngOnInit() {

  }

  // Définition des différentes balises pour le SEO
  addTag() {
    this.metaService.addTag({ httpEquiv: 'Content-Type', content: 'text/html' }); // Indique aux agents et serveurs de prendre le contenu de cette page en tant que HTML
    this.metaService.addTag({ name: 'description', content: "Pour toute information sur le jeu concours de thé à Nice, contactez Thé Tiptop. Nous sommes là pour répondre à vos questions et partager notre passion." }); // Meta description de la page
    this.metaService.addTag({ property: 'og-type', content: "Site web"}); /* Indique le type de l'objet */
    this.metaService.addTag({ name: 'robots', content: 'index,follow' }); // Permet au robot d'indexer la page
    this.metaService.addTag({ name: 'keywords', content: 'information thé Nice' }); //Add keyword
    this.metaService.addTag({ property: 'og:title', content: "Contactez-nous | Thé Tiptop | Jeu concours" }) // Titre pour l'encadré dans les recherches
  }


  buildCommonForm(): FormGroup {
    // Définir les regex pour la validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/u;
    const subjectRegex = /^[^<>{}[\]\/\\|#`]{1,50}$/;
    const messageUserRegex = /^[^<>{}[\]\/\\|#`]{1,1000}$/;


    const contactForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(emailRegex)]],
      subject: ['', [Validators.required, Validators.pattern(subjectRegex)]],
      messageUser: ['', [Validators.required, Validators.pattern(messageUserRegex)]],
      consent: [false, Validators.pattern('true')],
    });

    return contactForm;
  }

  // Ajoutez une propriété pour marquer les champs comme touchés
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

  submitForm() {
    this.formSubmitted = true;
    this.markFieldsAsTouched(this.contactForm);


    if (this.contactForm.valid) {
      this.formSubmitted = false;
      const formData = this.contactForm.value;

      // Envoyer les données au service pour les enregistrer dans la base de données
      this.contactService.submitContactForm(formData).subscribe(
        (response) => {
          this.submissionResult = {
            success: true,
            message: response.message,
          };
          this.contactForm.reset(); // Réinitialiser le formulaire après la soumission réussie
        },
        (error) => {
          console.error("==============>>>>>>>>", error);
          this.submissionResult = {
            success: false,
            message:
              "Une erreur s'est produite lors de l'envoi du message. Veuillez réessayer plus tard.",
          };
        }
      );

      // Envoyer les données au service pour l'envoi de l'e-mail
      this.contactService.sendContactEmail(formData).subscribe(
        (response) => {
          console.log('E-mail envoyé avec succès:', response);
        },
        (error) => {
          console.error('Erreur lors de l\'envoi de l\'e-mail:', error);
        }
      );

    }
  }
}
