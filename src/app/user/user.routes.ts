import { Routes } from '@angular/router';
import { authGuard } from '../guards/auth.guard';

export default [
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    { 
        path: 'parametre', loadComponent: () =>
        import('./dashboard/parametre/parametre.component').then((c) => c.ParametreComponent)
    },
    { 
        path: 'mon-compte', loadComponent: () =>
        import('./dashboard/mon-compte/mon-compte.component').then((c) => c.MonCompteComponent)
    }
] as Routes;
