import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe, NgFor } from '@angular/common';
import { AllTickets } from 'src/app/models/all-ticket.model';
import { UserAdmin } from 'src/app/models/user-admin.model';
import { AdminService } from 'src/app/services/admin/admin.service';
import { AgeService } from 'src/app/services/ageRanges/age.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CurrentDateService } from 'src/app/services/date/current-date.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, RouterModule, PaginationModule, NgFor, DecimalPipe, FormsModule, HttpClientModule],
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {
  title= 'Tickets - Dashboard | Thé Tiptop | Jeu concours';

  page = 1;
  pageSize = 10;
  allUsers: UserAdmin[] = []; // Contient tous les utilisateurs chargés à partir du serveur
  // users: UserAdmin[] = []; // Contient les utilisateurs actuellement affichés après le filtrage et la pagination
  filteredUsers: UserAdmin[] = [];
  totalItems: number = 0;
  collectionSize: number = 0;
  filterText: string = ''; // Permet de stocker la valeur saisie dans le filter sur le html

  allTickets: AllTickets[] = []; // Contient tous les tickets chargés à partir du serveur
  tickets: AllTickets[] = []; // Contient les tickets actuellement affichés après le filtrage et la pagination
  filteredTicket: AllTickets[] = [];
  totalTickets: number = 0; // On stocke en affichant en nombre, tous les tickets reçu
  usedTickets: number = 0;

  // Affichage pour le nombre total de tickets
  ticketUsed: number = 243;

  isLoggedAsAdmin: boolean = false; // True si on est connecté en tant qu'Admin

  constructor(private adminService: AdminService, private currentDateService: CurrentDateService, private ageService: AgeService, private auth: AuthService, private titleService : Title, private metaService: Meta) {
    this.titleService.setTitle(this.title);
    this.updateTag();
    this.getRoleUser();
    
    this.tickets = []; // Initialiser avec un tableau vide ou les données par défaut.
    this.filteredTicket = [...this.tickets]; // Initialiser filteredUsers avec une copie de users.
  }

  // Définition des différentes balises pour le SEO
  updateTag() {
    this.metaService.updateTag({ httpEquiv: 'Content-Type', content: 'text/html' }); // Indique aux agents et serveurs de prendre le contenu de cette page en tant que HTML
    this.metaService.updateTag({ property: 'og-type', content: "Site web"}); /* Indique le type de l'objet */
    this.metaService.updateTag({ name: 'robots', content: 'noindex, nofollow' }); // Permet au robot d'indexer la page
  }

  ngOnInit() {
    this.loadInitialData();
    console.log(this.allTickets);
  }

  loadInitialData() {

    this.adminService.getAllTickets().subscribe(
      (tickets: AllTickets[]) => {
        // Filtre les tickets attribués
        const usedTickets = tickets.filter(ticket => ticket.gainAttribue === '1.00');
        this.allTickets = tickets; // Stock les données du serveur dans allTickets
        console.log(this.allTickets);
        this.filteredTicket = [...this.allTickets]; // Initialise filteredUsers avec toutes les données
        this.totalItems = this.allTickets.length; // Initialise le nombre total d'éléments pour la pagination
        this.totalTickets = this.allTickets.length;
        this.usedTickets = usedTickets.length;
        console.log(this.totalTickets)
        console.log("Tickets attribués", this.usedTickets)
        // Met à jour les données graphiques
        // this.chartPie.data.datasets[0].data = [this.usedTickets, this.totalTickets - this.usedTickets];
        // Met à jour le graphique pour refléter les nouvelles données
        // this.chartPie.update();
        this.refreshTicketsFilters(); // Initialise les tickets affichés
      }
    )

  }

  // Méthode pour gérer le filtre dynamique sur le tableau
  onFilterChange() {
    console.log('Filter text:', this.filterText); // Vérifier la valeur actuelle du texte de filtrage
    this.filteredTicket = this.filterText
      ? this.allTickets.filter(tickets =>
        tickets.numTicket.toLowerCase().includes(this.filterText.toLowerCase()) ||
        tickets.montantAchat.toLowerCase().includes(this.filterText.toLowerCase()) ||
        tickets.gainAttribue.toLowerCase().includes(this.filterText.toLowerCase()) ||
        tickets.statusGain.toLowerCase().includes(this.filterText.toLowerCase()) ||
        (tickets.dateAchat && tickets.dateAchat.toLowerCase().includes(this.filterText.toLowerCase())) // Vérifies sur tickets.dateAchat est non null ensuite convertit celle-ci en minuscule.
      )
      : [...this.allTickets]; // Réinitialisez à la copie complète des tickets si le filtre est effacé
    //console.log(this.users)
    this.totalItems = this.filteredTicket.length; // Mettez à jour le nombre total d'éléments pour la pagination
    //console.log('Filtered users length:', this.filteredTicket.length); // Vérifier le nombre de tickets filtrés
    this.refreshTicketsFilters(); // Mettez à jour les tickets affichés
  }

  // Méthode pour gérer uniquement la pagination
  refreshTicketsFilters() {
    const startIndex = (this.page - 1) * this.pageSize;
    this.tickets = this.filteredTicket.slice(startIndex, startIndex + this.pageSize);
  }

  // Liée à la pagination, permet de remettre à jour celle-ci en fonction d'un événement qui se déclenche sur la page
  pageChanged(event: any): void {
    this.page = event.page;
    this.refreshTicketsFilters();
  }

  visiblePages(): number[] {
    const visiblePageCount = 5; // Changer cela selon vos besoins
    const totalPages = Math.ceil(this.totalItems / this.pageSize);
    const startPage = Math.max(1, this.page - Math.floor(visiblePageCount / 2));
    const endPage = Math.min(totalPages, startPage + visiblePageCount - 1);

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

  goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= Math.ceil(this.totalItems / this.pageSize)) {
      this.page = pageNumber;
      this.refreshTicketsFilters();
    }
  }

  // Nouvelle méthode pour effectuer le calcul avec Math.ceil
  calculatePageCount(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  getRoleUser(){
    if (this.auth.getRoleUser() === "admin") {
      this.isLoggedAsAdmin = true;
    } else {
      this.isLoggedAsAdmin = false;
    };
  }

}
