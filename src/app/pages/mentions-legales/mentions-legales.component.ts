import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-mentions-legales',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mentions-legales.component.html',
  styleUrls: ['./mentions-legales.component.scss']
})
export class MentionsLegalesComponent {
  title= 'Thé Tiptop - Grand Jeu Concours à Nice - Mentions légales';

   // Définition des différentes balises pour le SEO
   addTag() {
    this.metaService.addTag({ httpEquiv: 'Content-Type', content: 'text/html' }); // Indique aux agents et serveurs de prendre le contenu de cette page en tant que HTML
    this.metaService.addTag({ property: 'og-type', content: "Site web"}); /* Indique le type de l'objet */
    this.metaService.addTag({ name: 'robots', content: 'noindex, nofollow' }); // Permet au robot d'indexer la page
    this.metaService.addTag({ property: 'og:title', content: "Thé Tiptop - Grand Jeu Concours à Nice - Mentions légales" }) // Titre pour l'encadré dans les recherches
  }

  constructor(private titleService : Title, private metaService: Meta) {
    // Supprimer les metatags existants
    this.metaService.removeTag("name='description'");
    this.metaService.removeTag("name='keywords'");
    this.metaService.removeTag("property='og:title'");
    this.metaService.removeTag("name='robots'");
    this.titleService.setTitle(this.title);
    this.addTag();
  }

}
