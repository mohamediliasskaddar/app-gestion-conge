import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CongeDetailsComponent } from './pages/conge-details/conge-details.component';
import { CongeFormComponent } from './pages/conge-form/conge-form.component';
import { CongeTableComponent } from './pages/conge-table/conge-table.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { CongeCalendarComponent } from './pages/conge-calendar/conge-calendar.component';
export const routes: Routes = [ { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: LayoutComponent, // 👈 always renders sidebar + header
    children: [
      { path: '', redirectTo: 'conge-form', pathMatch: 'full' },
      { path: 'conge-form', component: CongeFormComponent },
      { path: 'conge-table', component: CongeTableComponent },
      { path: 'conge-details', component: CongeDetailsComponent },
      { path: 'conge-calendar', component: CongeCalendarComponent }
    ]
  },
  { path: '**', redirectTo: 'login' } ];
