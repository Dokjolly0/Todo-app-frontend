import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard'; // Assicurati che sia importato correttamente
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { HomeRedirectComponent } from './components/home-redirect/home-redirect.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';

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
  // Reset password
  { path: 'reset-password', component: ResetPasswordComponent },
  // Gestione della rotta 404
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}

// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { LoginComponent } from './pages/login/login.component';
// import { RegisterComponent } from './pages/register/register.component';
// import { DashboardComponent } from './pages/dashboard/dashboard.component';
// import { authGuard } from './guards/auth.guard'; // Assicurati che questo sia importato correttamente
// import { NotFoundComponent } from './pages/not-found/not-found.component';

// const routes: Routes = [
//   //Protected routes
//   {
//     path: 'app/dashboard',
//     component: DashboardComponent,
//     canActivate: [authGuard], // Protezione della rotta 'app/dashboard'
//   },
//   {
//     path: '',
//     canActivate: [authGuard], // Protezione della root path
//     children: [
//       {
//         path: '',
//         redirectTo: 'app/dashboard',
//         pathMatch: 'full',
//       },
//     ],
//   },
//   //Login
//   { path: 'signin', component: LoginComponent },
//   { path: 'login', redirectTo: 'signin' },
//   //Register
//   { path: 'signup', component: RegisterComponent },
//   { path: 'register', redirectTo: 'signup' },
//   //Any
//   { path: '404', component: NotFoundComponent },
//   { path: '**', redirectTo: '404' }, // Gestione della rotta 404
// ];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule],
// })
// export class AppRoutingModule {}
