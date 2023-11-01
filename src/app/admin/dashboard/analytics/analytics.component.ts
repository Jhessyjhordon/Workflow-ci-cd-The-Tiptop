import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { DecimalPipe, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// Appel du service admin
import { AdminService } from 'src/app/services/admin/admin.service';

// Structure de l'objet User qui va contenir un tableau
interface User {
	id?: number;
	lastname: string;
  firstname: string;
  birth_date: string;
  address: string;
	email: string;
	prize: string;
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, RouterModule, PaginationModule, NgFor, DecimalPipe, FormsModule, HttpClientModule],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent {
  page = 1;
	pageSize = 4;
  allUsers: User[] = []; // Contient tous les utilisateurs chargés à partir du serveur
	users: User[] = []; // Contient les utilisateurs actuellement affichés après le filtrage et la pagination
  filteredUsers: User[] = [];
  totalItems: number = 0;
  collectionSize: number = 0;
  filterText: string = ''; // Permet de stocker la valeur saisie dans le filter sur le html

  // Affichage pour le nombre total de tickets
  ticketUsed: number = 243;
  ticketTotal: number = 1200;

  constructor(private adminService: AdminService) {
    this.users = []; // Initialiser avec un tableau vide ou les données par défaut.
    this.filteredUsers = [...this.users]; // Initialiser filteredUsers avec une copie de users.
  }

  //Chart exemple
  title = 'ng-chart';
  chart : any = []; //Type la variable chart en any pour qu'elle accepte n'importe quelles données
  chartPie: any = [];

  ngOnInit() { // Initialise au chargement du component
    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: ['10 - 20', '21 - 30', '31 - 40', '41 - 50', '51 - 60', '61 - 70', '71 - 80'],
        datasets: [
          {
            label: '# of person age',
            data: [12, 19, 3, 5, 2, 3, 9], //Data en dur pour simuler des données sur le chart
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    this.chartPie = new Chart('canvasPie', {
      type: 'pie', // Type de graphique en camembert
      data: {
        labels: ['Tickets Used', 'Tickets Remaining'], // Labels pour le camembert
        datasets: [{
          label: 'Ticket Distribution', // Étiquette pour le jeu de données
          data: [this.ticketUsed, this.ticketTotal - this.ticketUsed], // Données pour le camembert
          backgroundColor: [ // Couleurs de fond pour chaque segment
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)'
          ],
          borderColor: [ // Couleurs de bordure pour chaque segment
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)'
          ],
          borderWidth: 1 // Largeur de la bordure des segments
        }]
      },
      options: {
        responsive: true, // Le graphique s'adapte à la taille du conteneur
        maintainAspectRatio: false, // Empêche le graphique de respecter le rapport d'aspect de canvas
        // D'autres options peuvent être ajoutées ici si nécessaire
      }
    });
    this.loadInitialData();
  }

  loadInitialData() {
    this.adminService.getUsersWithRoleClient().subscribe(
      (users: User[]) => {
        this.allUsers = users; // Stockez les données du serveur dans allUsers
        this.filteredUsers = [...this.allUsers]; // Initialise filteredUsers avec toutes les données
        this.totalItems = this.allUsers.length; // Initialise le nombre total d'éléments pour la pagination
        this.refreshUsersFilters(); // Initialise les utilisateurs affichés
      },
      error => {
        console.error('Error loading users:', error);
      }
    );
  }

  // Fonction pour gérer le filtre dynamique sur le tableau
  onFilterChange() {
    console.log('Filter text:', this.filterText); // Vérifier la valeur actuelle du texte de filtrage
    this.filteredUsers = this.filterText
      ? this.allUsers.filter(user =>
          user.lastname.toLowerCase().includes(this.filterText.toLowerCase()) ||
          user.firstname.toLowerCase().includes(this.filterText.toLowerCase()) ||
          user.email.toLowerCase().includes(this.filterText.toLowerCase())
        )
      : [...this.allUsers]; // Réinitialisez à la copie complète des utilisateurs si le filtre est effacé
    console.log(this.users)
    this.totalItems = this.filteredUsers.length; // Mettez à jour le nombre total d'éléments pour la pagination
    console.log('Filtered users length:', this.filteredUsers.length); // Vérifier le nombre d'utilisateurs filtrés
    this.refreshUsersFilters(); // Mettez à jour les utilisateurs affichés
  }

  // Fonction pour gérer uniquement la pagination
  refreshUsersFilters() {
    const startIndex = (this.page - 1) * this.pageSize;
    this.users = this.filteredUsers.slice(startIndex, startIndex + this.pageSize);
  }

  // Liée à la pagination, permet de remettre à jour celle-ci en fonction d'un événement qui se déclenche sur la page
  pageChanged(event: any): void {
    this.page = event.page;
    this.refreshUsersFilters();
  }
}

