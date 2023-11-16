import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  title= 'Accueil | Thé Tiptop | Jeu concours';

  constructor(private titleService : Title){
    this.titleService.setTitle(this.title);
  }

  images: string[] = [
    '/assets/images/home/logo-1-thetiptop.png',
    '/assets/images/home/logo-2-thetiptop.png',
    '/assets/images/home/logo-3-thetiptop.png',
    '/assets/images/home/logo-4-thetiptop.png',
    '/assets/images/home/logo-5-thetiptop.png'
  ];
}
