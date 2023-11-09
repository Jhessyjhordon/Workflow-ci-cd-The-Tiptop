import { Routes } from '@angular/router';

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
        path: 'recompenses', loadComponent: () =>
        import('./recompenses/recompenses.component').then((c) => c.RecompensesComponent)
    },
] as Routes;
