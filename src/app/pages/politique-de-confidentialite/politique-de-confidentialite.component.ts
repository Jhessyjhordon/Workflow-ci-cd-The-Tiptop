import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-politique-de-confidentialite',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './politique-de-confidentialite.component.html',
  styleUrls: ['./politique-de-confidentialite.component.scss']
})
export class PolitiqueDeConfidentialiteComponent {
  title= 'Thé Tiptop - Grand Jeu Concours à Nice - Politique de confidentialité';

  // Définition des différentes balises pour le SEO
  addTagPolitique() {
    this.metaService.addTag({ httpEquiv: 'Content-Type', content: 'text/html' }); // Indique aux agents et serveurs de prendre le contenu de cette page en tant que HTML
    this.metaService.addTag({ property: 'og-type', content: "Site web"}); /* Indique le type de l'objet */
    this.metaService.addTag({ name: 'robots', content: 'noindex, nofollow' }); // Permet au robot d'indexer la page
    this.metaService.addTag({ property: 'og:title', content: "Thé Tiptop - Grand Jeu Concours à Nice - Politique de confidentialité" }) // Titre pour l'encadré dans les recherches
  }

  constructor(private titleService : Title, private metaService: Meta) {
    this.titleService.setTitle(this.title);
    this.addTagPolitique();
  }

}
