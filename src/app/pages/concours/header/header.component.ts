import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  activeSlideIndex = 0; // Index du slide actif

  slides = [
    {
      imageSrc: '/assets/images/auth/auth_register.png',
      label: 'First slide label',
      content: 'Some representative placeholder content for the first slide.'
    },
    {
      imageSrc: '/assets/images/concours/header/cafe1.png',
      label: 'Second slide label',
      content: 'Some representative placeholder content for the second slide.'
    },
    {
      imageSrc: '/assets/images/concours/header/cafe2.png',
      label: 'Third slide label',
      content: 'Some representative placeholder content for the third slide.'
    },
    {
      imageSrc: '/assets/images/concours/header/cafe1.png',
      label: 'Fourth slide label',
      content: 'Some representative placeholder content for the fourth slide.'
    },
    // Ajoutez d'autres objets pour chaque slide ici
  ];

  constructor() { }

  ngOnInit(): void {
    // Votre code d'initialisation ici (peut être vide si vous n'en avez pas besoin)
  }

  ngAfterViewInit(): void {
    // const myCarousel = document.querySelector('#myCarousel') as HTMLElement;
    // const carousel = new bootstrap.Carousel(myCarousel, { interval: 500, wrap: true });
    // const slides = document.querySelectorAll('.carousel .carousel-item');
    // console.log(slides);


    // slides.forEach((el) => {
    //   const minPerSlide = slides.length;
    //   let next = el.nextElementSibling as HTMLElement;

    //   for (let i = 1; i < minPerSlide; i++) {
    //     if (!next) {
    //       next = slides[0] as HTMLElement;
    //     }

    //     const cloneChild = next.cloneNode(true) as HTMLElement;
    //     el.appendChild(cloneChild.children[0]);
    //     next = next.nextElementSibling as HTMLElement;
    //   }
    // });
  }

  // setActiveSlide(index: number) {
  //   this.activeSlideIndex = index;
  // }

  // getPreviousIndex() {
  //   return (this.activeSlideIndex - 1 + this.slides.length) % this.slides.length;
  // }

  // getNextIndex() {
  //   return (this.activeSlideIndex + 1) % this.slides.length;
  // }
}
