import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { DecimalPipe, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Structure de l'objet User qui va contenir un tableau
interface User {
	id?: number;
	name: string;
  firstname: string;
  birth: string;
  address: string;
	email: string;
	prize: string;
}

// Données brutes pour test le filtre
const USERS: User[] = [
	{
		name: 'Russia',
    firstname: 'Today',
    birth: '11/12/2023',
    address: '1 All Lorentz',
		email: 'toto@gmail.com',
		prize: 'Thé Noir',
	},
	{
		name: 'France',
    firstname: 'Le Parisien',
    birth: '11/12/2023',
    address: '1 All Lorentz',
		email: 'toto@gmail.com',
		prize: 'Aucun',
	},
	{
		name: 'Germany',
    firstname: 'Le Bosch',
    birth: '12/12/2023',
    address: '1 All Lorentz',
		email: 'toto@gmail.com',
		prize: 'Thé Noir',
	},
	{
		name: 'Portugal',
    firstname: 'Le BTP',
    birth: '12/12/2023',
    address: '1 All Lorentz',
		email: 'toto@gmail.com',
		prize: 'Thé Gris',
	},
	{
		name: 'Canada',
    firstname: 'Tabernacle',
    birth: '12/12/2023',
    address: '2 All Lorentz',
		email: 'toto2@gmail.com',
		prize: 'Thé Jaune',
	},
	{
		name: 'Vietnam',
    firstname: 'Ho Chinh Minh',
    birth: '15/12/2023',
    address: '3 All Lorentz',
		email: 'toto2@gmail.com',
		prize: 'Thé Noir',
	},
	{
		name: 'Brazil',
    firstname: 'Brasilia',
    birth: '16/12/2023',
    address: '3 All Lorentz',
		email: 'toto2@gmail.com',
		prize: 'Thé rouge',
	},
	{
		name: 'Mexico',
    firstname: 'Guadeleja',
    birth: '18/12/2023',
    address: '3 All Lorentz',
		email: 'toto3@gmail.com',
		prize: 'Thé rouge',
	},
	{
		name: 'United States',
    firstname: 'New York',
    birth: '18/12/2023',
    address: '3 All Lorentz',
		email: 'toto3@gmail.com',
		prize: 'Thé',
	},
	{
		name: 'India',
    firstname: 'Bombai',
    birth: '18/12/2023',
    address: '3 All Lorentz',
		email: 'toto3@gmail.com',
		prize: 'Thé',
	},
	{
		name: 'Indonesia',
    firstname: 'Indonesie',
    birth: '19/12/2023',
    address: '4 All Lorentz',
		email: 'toto3@gmail.com',
		prize: 'Infusion de thé',
	},
	{
		name: 'Tuvalu',
    firstname: 'Indonesie',
    birth: '19/12/2023',
    address: '3 All Lorentz',
		email: 'toto3@gmail.com',
		prize: 'Jackpot',
	},
	{
		name: 'China',
    firstname: 'Indonesie',
    birth: '19/12/2023',
    address: '3 All Lorentz',
		email: 'toto4@gmail.com',
		prize: 'Aucun',
	},
];

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, RouterModule, PaginationModule, NgFor, DecimalPipe, FormsModule],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent {
  totalItems: number = USERS.length;
  page = 1;
	pageSize = 4;
	collectionSize = USERS.length;
	users!: User[];
  filterText: string = ''; // Permet de stocker la valeur saisie dans le filter sur le html

  // Fonction pour gérer le filtre dynamique sur le tableau
  onFilterChange() { // On appelle cette fonction quand la valeur de filterText change
    const filteredUser = this.filterText
        ? USERS.filter(user=>
              user.name.toLowerCase().includes(this.filterText.toLowerCase()) || // Conditions de filtrage sur name
              user.firstname.toLowerCase().includes(this.filterText.toLowerCase()) || // Conditions de filtrage sur firstname
              user.prize.toLowerCase().includes(this.filterText.toLowerCase()) // Conditions de filtrage sur prize
          )
        : USERS;
    this.totalItems = filteredUser.length;
    this.refreshUsersFilters(filteredUser);
  }

  // Fonction permettant de paginer un sous-ensemble d'users tout en conservant le comportement par défaut de la pagination entière des USERS.
  refreshUsersFilters(filteredUser: User[] = USERS) {
      const startIndex = (this.page - 1) * this.pageSize;
      this.users = filteredUser.slice(startIndex, startIndex + this.pageSize);
  }
  //

  constructor() {
		this.refreshUsersFilters();
	}

  // Liée à la pagination, permet de remettre à jour celle-ci en fonction d'un événement qui se déclenche sur la page
  pageChanged(event: any): void {
    this.page = event.page;
    this.refreshUsersFilters();
  }

  //Chart exemple
  title = 'ng-chart';
  chart : any = []; //Type la variable chart en any pour qu'elle accepte n'importe quelles données

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
  }

}
