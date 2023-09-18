import { Routes } from '@angular/router';
import { PagesComponent } from './pages/pages.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

export const routes: Routes = [
    { 
        path: '', component: PagesComponent, 
        loadChildren: () => import('./pages/pages.routes')
    },
    { 
        path: 'auth', 
        loadChildren: () => import('./auth/auth.routes')
    }, 
    { path: '**', component: PageNotFoundComponent }
];
