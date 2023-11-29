import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './dashboard/user/user.component';
import { AnalyticsComponent } from './dashboard/analytics/analytics.component';
import { authGuard } from '../guards/auth.guard';
import { TicketsComponent } from './dashboard/tickets/tickets.component';
import { DetailTicketComponent } from './dashboard/detail-ticket/detail-ticket.component';
import { CreateTicketComponent } from './dashboard/create-ticket/create-ticket.component';
import { CreateUserComponent } from './dashboard/create-user/create-user.component';

export default [
    { 
        path: 'dashboard', 
        component: DashboardComponent,
        children: [
            { path: 'user', component: UserComponent },
            { path: 'analytics', component: AnalyticsComponent },
            { path: 'tickets', component: TicketsComponent },
            { path: 'detail-ticket/:id', component: DetailTicketComponent },
            { path: 'create-ticket', component: CreateTicketComponent },
            { path: 'app-create-user', component: CreateUserComponent}

            // autres routes enfants
        ]
    },
] as Routes;
