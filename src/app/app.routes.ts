import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CongeDetailsComponent } from './pages/conge-details/conge-details.component';
import { CongeFormComponent } from './pages/conge-form/conge-form.component';
import { CongeTableComponent } from './pages/conge-table/conge-table.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { CongeCalendarComponent } from './pages/conge-calendar/conge-calendar.component';
import { UserFormComponent } from './pages/user-form/user-form.component';
import { AuthGuard } from './guards/auth.guard';
export const routes: Routes = [ { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {path: 'user-form', component: UserFormComponent},

  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    component: LayoutComponent, 
    children: [
      { path: '', redirectTo: 'conge-form', pathMatch: 'full' },
      { path: 'conge-form', component: CongeFormComponent, canActivate: [AuthGuard] },
      { path: 'conge-table', component: CongeTableComponent, canActivate: [AuthGuard] },
      { path: 'conge-details', component: CongeDetailsComponent, canActivate: [AuthGuard] },
      { path: 'conge-calendar', component: CongeCalendarComponent, canActivate: [AuthGuard] }
    ]
  },
  { path: '**', redirectTo: 'login' } ];
