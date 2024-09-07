import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard'; // Assicurati che questo sia importato correttamente
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
  //Protected routes
  {
    path: 'app/dashboard',
    component: DashboardComponent,
    canActivate: [authGuard], // Protezione della rotta 'app/dashboard'
  },
  {
    path: '',
    canActivate: [authGuard], // Protezione della root path
    children: [
      {
        path: '',
        redirectTo: 'app/dashboard',
        pathMatch: 'full',
      },
    ],
  },
  //Login
  { path: 'signin', component: LoginComponent },
  { path: 'login', redirectTo: 'signin' },
  //Register
  { path: 'signup', component: RegisterComponent },
  { path: 'register', redirectTo: 'signup' },
  //Any
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404' }, // Gestione della rotta 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
