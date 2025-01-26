import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { JwtService } from '../../services/jwt.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  passwordVisible: boolean = false;
  pageTitle = 'Login todo app';
  rememberMe: boolean = false;
  errorMessage: string = ''; // Variabile per il messaggio di errore

  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private router: Router,
    private titleSrv: Title
  ) {}

  ngOnInit(): void {
    this.titleSrv.setTitle(this.pageTitle);
  }

  async login() {
    try {
      const response = await this.authService.login(this.username, this.password, this.rememberMe).toPromise();
      if (response) {
        this.router.navigate(['/app/dashboard']);
      }
    } catch (err) {
      // Gestiamo l'errore e mostriamo un messaggio dinamico
      if (
        (err as any)?.error?.message ===
        'Account non attivato. Controlla la tua casella mail per confermare la registrazione.'
      ) {
        this.errorMessage =
          'Il tuo account non è ancora attivato. Controlla la tua casella email per attivare il tuo account.';
      } else {
        this.errorMessage = 'Username o password errati. Riprova.';
      }
    }
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    if (this.passwordVisible) passwordInput.type = 'text';
    else passwordInput.type = 'password';
  }
}
