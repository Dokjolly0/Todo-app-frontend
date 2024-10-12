import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser'; // Importa il servizio Title
import { JwtService } from '../../services/jwt.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private router: Router,
    private titleSrv: Title
  ) {}
  username: string = '';
  password: string = '';
  passwordVisible: boolean = false;
  pageTitle = 'Login todo app';

  ngOnInit(): void {
    this.titleSrv.setTitle(this.pageTitle);
  }

  login() {
    this.authService.login(this.username, this.password).subscribe(
      () => {
        this.router.navigate(['/app/dashboard']);
      },
      (err: any) => {
        alert('Username o password errati');
      }
    );
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
    const passwordInput = document.getElementById('password') as HTMLInputElement;

    if (this.passwordVisible) passwordInput.type = 'text';
    else passwordInput.type = 'password';
  }
}
