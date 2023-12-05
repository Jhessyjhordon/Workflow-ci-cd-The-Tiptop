import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent {

  title= 'Thé Tiptop - Grand Jeu Concours à Nice - Page non trouvée';

  // Définition des différentes balises pour le SEO
  updateTag() {
    this.metaService.updateTag({ httpEquiv: 'Content-Type', content: 'text/html' }); // Indique aux agents et serveurs de prendre le contenu de cette page en tant que HTML
    this.metaService.updateTag({ property: 'og-type', content: "Site web"}); /* Indique le type de l'objet */
    this.metaService.updateTag({ name: 'robots', content: 'noindex, nofollow' }); // Permet au robot d'indexer la page
    this.metaService.updateTag({ property: 'og:title', content: "Thé Tiptop - Grand Jeu Concours à Nice - Page non trouvée" }) // Titre pour l'encadré dans les recherches
  }

  constructor(private titleService : Title, private metaService: Meta) {
    this.metaService.removeTag("name='description'");
    this.titleService.setTitle(this.title);
    this.updateTag();
  }


}
