import { Routes } from '@angular/router';
import { authGuard } from '../guards/auth.guard';

export default [
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    { 
        path: 'profile-detail', loadComponent: () =>
        import('./dashboard/profile-detail/profile-detail.component').then((c) => c.ProfileDetailComponent)
    },
    { 
        path: 'profile', loadComponent: () =>
        import('./dashboard/profile/profile.component').then((c) => c.ProfileComponent)
    }
] as Routes;
