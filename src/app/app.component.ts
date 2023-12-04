import { Component, Renderer2, Inject, OnInit } from '@angular/core'; // Import Renderer2 pour manipuler le DOM
import { DOCUMENT } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { LayoutsComponent } from './layouts/layouts.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LayoutsComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title='the-tiptop-front';
  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private router: Router
  ) {}

  ngOnInit() {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd) // Ecoute l'événement de navigation et filtre pour ne réagir qu'à NavigationEnd (soit un événment qui indique une navigation terminée avec succès)
    ).subscribe(event => {
      this.addCanonicalURL(`https://dsp-archiwebo22b-ji-rw-ah.fr${event.urlAfterRedirects}`); // Créer un nouvel événement qui ajoute un link comme attribut
    });
  }

  addCanonicalURL(url: string) {
    const head = this.document.getElementsByTagName('head')[0];
    let link: HTMLLinkElement = this.renderer.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url);

    // Remove existing canonical link if it exists
    let existingLink = this.document.querySelector('link[rel="canonical"]');
    if (existingLink) {
      this.renderer.removeChild(head, existingLink);
    }

    this.renderer.appendChild(head, link);
  }
}
