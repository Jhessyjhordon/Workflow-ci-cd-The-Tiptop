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

  title= 'Thé Tiptop - Grand Jeu Concours à Nice - Récompenses';

  // Définition des différentes balises pour le SEO
  updateTag() {
    this.metaService.updateTag({ httpEquiv: 'Content-Type', content: 'text/html' }); // Indique aux agents et serveurs de prendre le contenu de cette page en tant que HTML
    this.metaService.updateTag({ name: 'description', content: "Thé Tiptop, site de jeu concours de thé pour les 10 ans et l'ouverture de la boutique à Nice. Découvrez nos récompenses !" }); // Meta description de la page
    this.metaService.updateTag({ property: 'og-type', content: "Site web"}); /* Indique le type de l'objet */
    this.metaService.updateTag({ name: 'robots', content: 'index,follow' }); // Permet au robot d'indexer la page
    this.metaService.updateTag({ name: 'keywords', content: 'récompenses Nice' }); //Add keyword
    this.metaService.updateTag({ property: 'og:title', content: "Thé Tiptop - Grand Jeu Concours à Nice - Récompenses" }) // Titre pour l'encadré dans les recherches
  }

  constructor(private auth: AuthService, private titleService : Title, private metaService: Meta) {
    this.titleService.setTitle(this.title);
    this.updateTag();
  }

  ngOnInit(): void {
    this.auth.isLoggedIn().subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
  }
}
