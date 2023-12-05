import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  ngOnInit(){
    this.loadAxeptioScript();
  }

  loadAxeptioScript(){
     // Définir les paramètres Axeptio
    (window as any).axeptioSettings = {
      clientId: "655e146f508b50f44623bccc",
      cookiesVersion: "projet dsp5 - archi o22b-fr-3",
    };

    // Used to setup up cookie AXEPTIO in Angular 
    const script = document.createElement('script');
    script.async = true;
    script.src = "//static.axept.io/sdk.js";
    document.body.appendChild(script); // Vous pouvez aussi utiliser document.head si nécessaire
  }
}
