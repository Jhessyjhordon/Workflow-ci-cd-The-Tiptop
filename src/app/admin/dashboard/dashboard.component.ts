import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  title= 'Dashboard | Thé Tiptop | Jeu concours';
  isSidebarActive = false;
  isLoggedAsAdmin: boolean = false; // True si on est connecté en tant qu'Admin

  constructor(private auth: AuthService, private titleService : Title, private metaService: Meta) {
    this.titleService.setTitle(this.title);
    this.updateTag();
  }

  // Définition des différentes balises pour le SEO
  updateTag() {
    this.metaService.updateTag({ httpEquiv: 'Content-Type', content: 'text/html' }); // Indique aux agents et serveurs de prendre le contenu de cette page en tant que HTML
    this.metaService.updateTag({ property: 'og-type', content: "Site web"}); /* Indique le type de l'objet */
    this.metaService.updateTag({ name: 'robots', content: 'noindex, nofollow' }); // Permet au robot d'indexer la page
  }

  ngOnInt() {
    if (this.auth.getRoleUser() === "admin") {
      this.isLoggedAsAdmin = true;
    } else {
      this.isLoggedAsAdmin = false;
    };
  }

  toggleSidebar() {
    this.isSidebarActive = !this.isSidebarActive;
  }

  logout() {
    this.auth.logout();
  }

}
