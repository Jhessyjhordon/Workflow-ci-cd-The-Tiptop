import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { GainsDetailleComponent } from './gains-detaille/gains-detaille.component';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-concours',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, GainsDetailleComponent],
  templateUrl: './concours.component.html',
  styleUrls: ['./concours.component.scss']
})
export class ConcoursComponent {
  title= 'Thé Tiptop - Grand Jeu Concours à Nice - Concours';

  constructor(private titleService : Title, private metaService: Meta){
    // Supprimer les metatags existants
    this.metaService.removeTag("name='description'");
    this.metaService.removeTag("name='keywords'");
    this.metaService.removeTag("property='og:title'");
    this.metaService.removeTag("name='robots'");
    this.titleService.setTitle(this.title);
    this.addTag();
  }

  // Définition des différentes balises pour le SEO
  addTag() {
    this.metaService.addTag({ httpEquiv: 'Content-Type', content: 'text/html' }); // Indique aux agents et serveurs de prendre le contenu de cette page en tant que HTML
    this.metaService.addTag({ name: 'description', content: "Participez à notre jeu concours exclusif à Nice chez Thé Tiptop pour célébrer l'ouverture de notre nouvelle boutique et nos 10 ans de passion pour le thé." }); // Meta description de la page
    this.metaService.addTag({ property: 'og-type', content: "Site web"}); /* Indique le type de l'objet */
    this.metaService.addTag({ name: 'robots', content: 'index,follow' }); // Permet au robot d'indexer la page
    this.metaService.addTag({ name: 'keywords', content: 'concours Nice' }); //Add keyword
    this.metaService.addTag({ property: 'og:title', content: "Thé Tiptop - Grand Jeu Concours à Nice - Concours" }) // Titre pour l'encadré dans les recherches
  }
  
}
