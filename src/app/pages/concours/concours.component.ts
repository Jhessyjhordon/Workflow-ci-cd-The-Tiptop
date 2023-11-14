import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { GainsDetailleComponent } from './gains-detaille/gains-detaille.component';

@Component({
  selector: 'app-concours',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, GainsDetailleComponent],
  templateUrl: './concours.component.html',
  styleUrls: ['./concours.component.scss']
})
export class ConcoursComponent {

  // enableHorizontalScroll = false;

  // @HostListener('window:scroll', ['$event'])
  // onScroll(event: Event): void {
  //   // Détectez le défilement vertical ici
  //   const scrollTop = window.scrollY;    
  //   console.log(scrollTop);
    
    
  //   // Utilisez une ancre HTML pour déterminer quand activer le défilement horizontal
  //   const anchorElement = document.getElementById('horizontal-scroll-anchor');
    
  //   if (anchorElement) {
  //     const anchorRect = anchorElement.getBoundingClientRect();
  //     const anchorOffsetTop = anchorRect.top + scrollTop;
  //     console.log(anchorRect.top);
  //     console.log(anchorOffsetTop);
      
  //     this.enableHorizontalScroll = scrollTop >= anchorOffsetTop;
  //   }
  // }
  
}
