import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(private authService: AuthService, private router: Router) {}
  username: string = '';
  password: string = '';
  passwordVisible: boolean = false;

  ngOnInit(): void {
    this.fixWidth();
  }

  login() {
    this.authService.login(this.username, this.password).subscribe(
      () => {
        const user = this.authService.getUser();
        const token = this.authService.getToken();
        console.log('User:', user);
        console.log('Token:', token);
        this.router.navigate(['/app/dashboard']);
      },
      (err: any) => {
        alert('Username o password errati');
      }
    );
  }

  fixWidth() {
    const inputElement = document.getElementById(
      'password'
    ) as HTMLInputElement;
    const submitButton = document.getElementById('submit') as HTMLInputElement;

    const width = inputElement.offsetWidth;
    submitButton.style.width = `${width}px`;
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
    const passwordInput = document.getElementById(
      'password'
    ) as HTMLInputElement;

    if (this.passwordVisible) passwordInput.type = 'text';
    else passwordInput.type = 'password';
  }
}
