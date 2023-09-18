import { Routes } from '@angular/router';
import { authGuard } from '../guards/auth.guard';

export default [
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    { 
        path: 'home', loadComponent: () =>
        import('./home/home.component').then((c) => c.HomeComponent)
    },
    { 
        path: 'concours', loadComponent: () =>
        import('./concours/concours.component').then((c) => c.ConcoursComponent)
    },
    { 
        path: 'contact', loadComponent: () =>
        import('./contact/contact.component').then((c) => c.ContactComponent)
    },
    { 
        path: 'recompences', canActivate: [authGuard], loadComponent: () =>
        import('./recompences/recompences.component').then((c) => c.RecompencesComponent)
    },
] as Routes;
