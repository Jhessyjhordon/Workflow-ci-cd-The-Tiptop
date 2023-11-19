import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { DecimalPipe, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserAdmin } from 'src/app/models/user-admin.model';
import { AllTickets } from 'src/app/models/all-ticket.model';
// Appel du service admin & currentDateService et AgeService
import { AdminService } from 'src/app/services/admin/admin.service';
import { CurrentDateService } from 'src/app/services/date/current-date.service';
import { AgeService } from 'src/app/services/ageRanges/age.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Meta, Title } from '@angular/platform-browser';
import { emailing } from 'src/app/models/emailing.model';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, RouterModule, PaginationModule, NgFor, DecimalPipe, FormsModule, HttpClientModule],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  title= 'Analytics - Dashboard | Thé Tiptop | Jeu concours';
  page = 1;
  pageSize = 5;
  allUsers: UserAdmin[] = []; // Contient tous les utilisateurs chargés à partir du serveur
  users: UserAdmin[] = []; // Contient les utilisateurs actuellement affichés après le filtrage et la pagination
  filteredUsers: UserAdmin[] = [];
  totalItems: number = 0;
  collectionSize: number = 0;
  filterText: string = ''; // Permet de stocker la valeur saisie dans le filter sur le html
  email: emailing[] = [];

  allTickets: AllTickets[] = []; // Contient tous les tickets chargés à partir du serveur
  totalTickets: number = 0; // On stocke en affichant en nombre, tous les tickets reçu
  usedTickets: number = 0;

  // Déclaration anneeActuelle en number
  anneeActuelle: number;

  chart: any = []; //Type la variable chart en any pour qu'elle accepte n'importe quelles données
  // Définition d'une propriété pour le chart camembert
  chartPie: any = [];

  isLoggedAsAdmin: boolean = false; // True si on est connecté en tant qu'Admin

  // Ici, #canvasElement et #canvasPieElement sont des références locales qui peuvent être utilisées dans le fichier TypeScript pour accéder aux éléments du DOM.
  @ViewChild('canvasElement') canvas: ElementRef | null = null;
  @ViewChild('canvasPieElement') canvasPie: ElementRef | null = null;

  constructor(private adminService: AdminService, private currentDateService: CurrentDateService, private ageService: AgeService, private auth: AuthService, private titleService : Title, private metaService: Meta, private changeDetectorRef: ChangeDetectorRef) {
    this.titleService.setTitle(this.title);
    this.addTag();
    
    this.users = []; // Initialiser avec un tableau vide ou les données par défaut.
    this.filteredUsers = [...this.users]; // Initialiser filteredUsers avec une copie de users.
    this.anneeActuelle = this.currentDateService.getAnneeActuelle();
    console.log("-->", this.anneeActuelle);
  }

  // Définition des différentes balises pour le SEO
  addTag() {
    this.metaService.addTag({ httpEquiv: 'Content-Type', content: 'text/html' }); // Indique aux agents et serveurs de prendre le contenu de cette page en tant que HTML
    this.metaService.addTag({ property: 'og-type', content: "Site web"}); /* Indique le type de l'objet */
    this.metaService.addTag({ name: 'robots', content: 'noindex, nofollow' }); // Permet au robot d'indexer la page
  }
  

  ngOnInit() { // Initialise au chargement du component
    console.log(this.auth.getRoleUser());
    // Vérification du role pour passer true à la variable "isLoggedAsAdmin"
    if (this.auth.getRoleUser() === "admin") {
      console.log("ok");
      this.isLoggedAsAdmin = true;
    } else console.log("not admin");
    this.loadInitialData();
  }

  ngAfterViewInit() {
    // Vérifiez que les éléments canvas et canvasPie sont présents
    if (this.canvas && this.canvas.nativeElement && this.canvasPie && this.canvasPie.nativeElement) {
      // Initialisation des graphiques ici
      this.chart = new Chart('canvas', {
        type: 'bar',
        data: {
          labels: ['10 - 20', '21 - 30', '31 - 40', '41 - 50', '51 - 60', '61 - 70', '71 - 80'],
          datasets: [
            {
              label: '# of person age',
              data: [], //Initialisation du tableau avec des données vides
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
          labels: ['Tickets attribués', 'Tickets restants'], // Labels pour le camembert
          datasets: [{
            label: 'Ticket Distribution', // Étiquette pour le jeu de données
            data: [0, 0], // Données pour le camembert
            backgroundColor: [ // Couleurs de fond pour chaque segment
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 99, 132, 0.2)'
            ],
            borderColor: [ // Couleurs de bordure pour chaque segment
              'rgba(54, 162, 235, 1)',
              'rgba(255,99,132,1)'
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
    }
  }

  loadInitialData() {

    /*this.adminService.getUsersWithEmailing().subscribe(
      (email: emailing[]) => {
        this.email = email; // Stock les emails de newsletter
        this.changeDetectorRef.detectChanges(); // Détection manuelle des changements
        console.log("Newsletter ====>", this.email)
      }
    );*/

    this.adminService.getUsersWithRoleClient().subscribe(
      (users: UserAdmin[]) => {
        this.allUsers = users; // Stockez les données du serveur dans allUsers
        this.filteredUsers = [...this.allUsers]; // Initialise filteredUsers avec toutes les données
        this.totalItems = this.allUsers.length; // Initialise le nombre total d'éléments pour la pagination
        const ageCounts = this.ageService.calculateAgeCounts(this.allUsers); // Appel du service age pour calculer l'âge de chaque user
        this.updateChartData(ageCounts);
        this.refreshUsersFilters(); // Initialise les utilisateurs affichés
        //console.log('---->', this.allUsers);
      },
      error => {
        console.error('Error loading users:', error);
      }
    );


    this.adminService.getAllTickets().subscribe(
      (allTickets: AllTickets[]) => {
        // Filtre les tickets attribués
        const usedTickets = allTickets.filter(ticket => ticket.gainAttribue === '1.00');
        console.log(allTickets);
        this.allTickets = allTickets; // Stock les données du serveur dans allTickets
        this.totalTickets = allTickets.length;
        this.usedTickets = usedTickets.length;
        console.log(this.totalTickets)
        console.log("Tickets attribués", this.usedTickets)
        // Met à jour les données graphiques
        this.chartPie.data.datasets[0].data = [this.usedTickets, this.totalTickets - this.usedTickets];
        // Met à jour le graphique pour refléter les nouvelles données
        this.chartPie.update();
        this.refreshUsersFilters(); // Initialise les utilisateurs affichés
      }
    )
  }

  updateChartData(ageCounts: any) {
    // Conversion de l'objet ageCounts en un tableau pour le graphique
    const chartData = Object.values(ageCounts);
    // Mise à jour des données du graphique
    this.chart.data.datasets[0].data = chartData;
    this.chart.update(); // Redessine le graphique avec les nouvelles données
  }

  // Méthode pour gérer le filtre dynamique sur le tableau
  onFilterChange() {
    console.log('Filter text:', this.filterText); // Vérifier la valeur actuelle du texte de filtrage
    this.filteredUsers = this.filterText
      ? this.allUsers.filter(user =>
        user.lastname.toLowerCase().includes(this.filterText.toLowerCase()) ||
        user.firstname.toLowerCase().includes(this.filterText.toLowerCase()) ||
        user.email.toLowerCase().includes(this.filterText.toLowerCase()) ||
        (user.birthDate && user.birthDate.toLowerCase().includes(this.filterText.toLowerCase())) || // Vérifies sur user.birthDate est non null ensuite convertit celle-ci en minuscule.
        (user.address && user.address.toLowerCase().includes(this.filterText.toLowerCase()))
      )
      : [...this.allUsers]; // Réinitialisez à la copie complète des utilisateurs si le filtre est effacé
    //console.log(this.users)
    this.totalItems = this.filteredUsers.length; // Mettez à jour le nombre total d'éléments pour la pagination
    //console.log('Filtered users length:', this.filteredUsers.length); // Vérifier le nombre d'utilisateurs filtrés
    this.refreshUsersFilters(); // Mettez à jour les utilisateurs affichés
  }

  // Méthode pour gérer uniquement la pagination
  refreshUsersFilters() {
    const startIndex = (this.page - 1) * this.pageSize;
    this.users = this.filteredUsers.slice(startIndex, startIndex + this.pageSize);
  }

  // Liée à la pagination, permet de remettre à jour celle-ci en fonction d'un événement qui se déclenche sur la page
  pageChanged(event: any): void {
    this.page = event.page;
    this.refreshUsersFilters();
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
      this.refreshUsersFilters();
    }
  }

  // Nouvelle méthode pour effectuer le calcul avec Math.ceil
  calculatePageCount(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  deleteUser(userId: number) {
    this.adminService.deleteUserById(userId).subscribe(
      () => {
        console.log(`User with ID ${userId} deleted successfully.`);
        // Ajoutez ici une logique supplémentaire si nécessaire, par exemple, mettre à jour la liste des utilisateurs
      },
      (error) => {
        console.error('Error deleting user:', error);
        // Ajoutez ici une logique supplémentaire si nécessaire, par exemple, afficher un message d'erreur à l'utilisateur
      }
    );
  }

}
