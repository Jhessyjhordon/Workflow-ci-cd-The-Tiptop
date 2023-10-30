import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutsComponent } from '../layouts/layouts.component';
import { DashboardComponent } from '../admin/dashboard/dashboard.component';

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [CommonModule, LayoutsComponent, DashboardComponent],
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent {

}
