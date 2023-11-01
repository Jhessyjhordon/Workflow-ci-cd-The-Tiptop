import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './dashboard/user/user.component';
import { AnalyticsComponent } from './dashboard/analytics/analytics.component';
import { authGuard } from '../guards/auth.guard';

export default [
    { 
        path: 'dashboard', 
        component: DashboardComponent,
        children: [
            { path: 'user', component: UserComponent },
            { path: 'analytics', component: AnalyticsComponent },
            // autres routes enfants
        ]
    },
] as Routes;
