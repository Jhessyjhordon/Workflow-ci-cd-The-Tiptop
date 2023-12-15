import { Component, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  
  ngOnInit(){
    if (isPlatformBrowser(this.platformId)) { // Vérifie si le code ne s'exécute que sur le navigateur
      // Exécuté seulement côté client
      this.loadAxeptioScript();
    }
  }

  loadAxeptioScript(){
    // Commentaire pour la démonstration
    // Définir les paramètres Axeptio
    (window as any).axeptioSettings = {
      clientId: "655e146f508b50f44623bccc",
      cookiesVersion: "projet dsp5 - archi o22b-fr-3",
    };

    // Chargement du script Axeptio seulement si on est côté client
    const script = document.createElement('script');
    script.async = true;
    script.src = "//static.axept.io/sdk.js";
    document.body.appendChild(script);
  }
}
