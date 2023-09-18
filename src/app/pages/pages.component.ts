import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutsComponent } from '../layouts/layouts.component';

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [CommonModule, LayoutsComponent],
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent {

}
