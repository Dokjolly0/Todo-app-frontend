import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AddTodoComponent } from './components/add-todo/add-todo.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { UserAvatarComponent } from './components/user-avatar/user-avatar.component';
import { EditTodoComponent } from './components/edit-todo/edit-todo.component';
import { HomeRedirectComponent } from './components/home-redirect/home-redirect.component';
import { EyesIconComponent } from './components/eyes-icon/eyes-icon.component';
import { RequestResetPasswordComponent } from './pages/request-reset-password/request-reset-password.component';
import { ConfirmEmailComponent } from './pages/confirm-email/confirm-email.component';
import { ConfirmEmailFailedComponent } from './pages/confirm-email-failed/confirm-email-failed.component';
import { PasswordResetWithEmailComponent } from './pages/password-reset-with-email/password-reset-with-email.component';
import { SuccessPopupComponent } from './components/succes-popup/success-popup.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    AddTodoComponent,
    NotFoundComponent,
    TodoItemComponent,
    UserAvatarComponent,
    EditTodoComponent,
    HomeRedirectComponent,
    EyesIconComponent,
    RequestResetPasswordComponent,
    ConfirmEmailComponent,
    ConfirmEmailFailedComponent,
    PasswordResetWithEmailComponent,
    SuccessPopupComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule, NgbModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
