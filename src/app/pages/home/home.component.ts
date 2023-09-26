import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  images: string[] = [
    '/assets/images/home/qualite-superieure-thetiptop.png',
    '/assets/images/home/qualite-superieure-thetiptop.png',
    '/assets/images/home/qualite-superieure-thetiptop.png',
    '/assets/images/home/qualite-superieure-thetiptop.png',
    '/assets/images/home/qualite-superieure-thetiptop.png'
  ];
}
