import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard'; // Assicurati che sia importato correttamente
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { HomeRedirectComponent } from './components/home-redirect/home-redirect.component';
import { RequestResetPasswordComponent } from './pages/request-reset-password/request-reset-password.component';
import { ConfirmEmailComponent } from './pages/confirm-email/confirm-email.component';
import { ConfirmEmailFailedComponent } from './pages/confirm-email-failed/confirm-email-failed.component';
import { PasswordResetWithEmailComponent } from './pages/password-reset-with-email/password-reset-with-email.component';

const routes: Routes = [
  // Rotta root che utilizza il RedirectComponent
  {
    path: '',
    component: HomeRedirectComponent, // Questa è la rotta per la root "/"
  },
  // Rotta protetta per la dashboard
  {
    path: 'app/dashboard',
    component: DashboardComponent,
    canActivate: [authGuard], // Protezione della rotta 'app/dashboard'
  },
  // Login
  { path: 'signin', component: LoginComponent },
  { path: 'login', redirectTo: 'signin' },
  // Register
  { path: 'signup', component: RegisterComponent },
  { path: 'register', redirectTo: 'signup' },
  // // Reset password
  // { path: 'reset-password', component: requestResetPasswordComponent },
  // Confirm email
  {
    path: 'confirm-email',
    component: ConfirmEmailComponent,
  },
  {
    path: 'confirm-email-failed',
    component: ConfirmEmailFailedComponent,
  },
  {
    path: 'request-reset-password',
    component: RequestResetPasswordComponent,
  },
  {
    path: 'reset-password-with-email',
    component: PasswordResetWithEmailComponent,
  },
  // Gestione della rotta 404
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
