import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HeaderComponent } from './header/header.component';
import { MesGainsComponent } from './mes-gains/mes-gains.component';
import { GainsPotentielsComponent } from './gains-potentiels/gains-potentiels.component';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-recompenses',
  standalone: true,
  imports: [CommonModule, HeaderComponent, MesGainsComponent, GainsPotentielsComponent],
  templateUrl: './recompenses.component.html',
  styleUrls: ['./recompenses.component.scss']
})
export class RecompensesComponent {
  isLoggedIn: boolean = false;

  title= 'Récompenses | Thé Tiptop | Jeu concours';

  // Définition des différentes balises pour le SEO
  addTag() {
    this.metaService.addTag({ httpEquiv: 'Content-Type', content: 'text/html' }); // Indique aux agents et serveurs de prendre le contenu de cette page en tant que HTML
    this.metaService.addTag({ name: 'description', content: "Thé Tiptop, site de jeu concours de thé pour les 10 ans et l'ouverture de la boutique à Nice. Découvrez nos récompenses !" }); // Meta description de la page
    this.metaService.addTag({ property: 'og-type', content: "Site web"}); /* Indique le type de l'objet */
    this.metaService.addTag({ name: 'robots', content: 'index,follow' }); // Permet au robot d'indexer la page
    this.metaService.addTag({ name: 'keywords', content: 'récompenses thé Nice' }); //Add keyword
    this.metaService.addTag({ property: 'og:title', content: "Récompenses | Thé Tiptop | Jeu concours" }) // Titre pour l'encadré dans les recherches
  }

  constructor(private auth: AuthService, private titleService : Title, private metaService: Meta) {
    this.titleService.setTitle(this.title);
    this.addTag();
  }

  ngOnInit(): void {
    this.auth.isLoggedIn().subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
  }
}
