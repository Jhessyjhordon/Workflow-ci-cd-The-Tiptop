import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ContactService } from 'src/app/services/contact/contact.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup;
  formSubmitted: boolean = false;

  submissionResult: { success: boolean; message: string } | null = null;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService
  ) {
    this.contactForm = this.buildCommonForm();
  }

  ngOnInit() {

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
