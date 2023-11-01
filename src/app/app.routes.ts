import { Routes } from '@angular/router';
import { PagesComponent } from './pages/pages.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { 
        path: '', component: PagesComponent, 
        loadChildren: () => import('./pages/pages.routes')
    },
    { 
        path: 'auth', 
        loadChildren: () => import('./auth/auth.routes')
    }, 
    { 
        path: 'admin', 
        loadChildren: () => import('./admin/admin.routes'),
        canActivate: [authGuard]
    }, 
    { path: '**', component: PageNotFoundComponent }
];
