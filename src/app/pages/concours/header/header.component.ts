import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as bootstrap from 'bootstrap';
import { TicketVerifyService } from 'src/app/services/ticketVerify/ticket-verify.service';
import { Ticket } from 'src/app/models/ticket.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  verifyTicketForm!: FormGroup;
  formSubmitted: boolean = false;
  submissionResult: { success: boolean; message: string } | null = null;
  activeSlideIndex = 0; // Index du slide actif

  slides = [
    {
      imageSrc: '/assets/images/auth/auth_register.png',
      label: 'First slide label',
      content: 'Some representative placeholder content for the first slide.'
    },
    {
      imageSrc: '/assets/images/concours/header/cafe1.png',
      label: 'Second slide label',
      content: 'Some representative placeholder content for the second slide.'
    },
    {
      imageSrc: '/assets/images/concours/header/cafe2.png',
      label: 'Third slide label',
      content: 'Some representative placeholder content for the third slide.'
    },
    {
      imageSrc: '/assets/images/concours/header/cafe1.png',
      label: 'Fourth slide label',
      content: 'Some representative placeholder content for the fourth slide.'
    },
    // Ajoutez d'autres objets pour chaque slide ici
  ];

  constructor(private ticketVerify: TicketVerifyService, private fb: FormBuilder) {
    this.verifyTicketForm = this.buildCommonForm();
  }

  ngOnInit(): void {
    // Votre code d'initialisation ici (peut être vide si vous n'en avez pas besoin)
  }

  buildCommonForm(): FormGroup {
    // Définir les regex pour la validation
    const numTicketRegex = /^(1000|[1-9]\d{3})$/u;

    const verifyTicketFormBuilder = this.fb.group({
      numTicket: ['', [Validators.required, Validators.pattern(numTicketRegex)]]
    });

    return verifyTicketFormBuilder;
  }

  getTicketById() {
    this.formSubmitted = true;

    if (this.verifyTicketForm.valid) {
      this.formSubmitted = false;
      // const numTicket = this.verifyTicketForm.value as number;
      // Accéder directement à la propriété du formulaire et convertir en nombre.
      // L'opérateur + est utilisé pour effectuer la conversion en nombre.
      const numTicket = +this.verifyTicketForm.get('numTicket')!.value;

      console.log(numTicket);


      this.ticketVerify.verifyTicket(numTicket).subscribe(
        (response: Ticket) => {
          console.log(response);
        },
        error => {
          console.error('Error ticket :', error);
        }
      )
    }
  }




}
