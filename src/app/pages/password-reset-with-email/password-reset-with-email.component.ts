import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-reset-with-email',
  templateUrl: './password-reset-with-email.component.html',
  styleUrl: './password-reset-with-email.component.css',
})
export class PasswordResetWithEmailComponent {
  constructor(private userService: UserService, private router: Router) {}
  password: string = '';
  passwordVisible: boolean = false;
  checkPassword: string = '';
  checkPasswordVisible: boolean = false;
  tokenChangePassword: string = '';
  userId: string = '';
  resetState: boolean = false;

  ngOnInit(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token')!;
    const userId = urlParams.get('userId')!;
    this.tokenChangePassword = token;
    this.userId = userId;
  }

  onSubmit() {
    if (this.password !== this.checkPassword) {
      alert('Passwords do not match');
      return;
    }
    // Chiamata al servizio per cambiare la password
    this.userService.changePasswordWithEmail(this.userId, this.tokenChangePassword, this.password).subscribe(
      (response) => {
        this.resetState = true;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 5000); // 5000 millisecondi = 5 secondi
      },
      (error) => {
        alert('Error changing password');
      }
    );
  }

  closeAlert() {
    this.resetState = false;
    this.router.navigate(['/login']);
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    if (this.passwordVisible) passwordInput.type = 'text';
    else passwordInput.type = 'password';
  }

  toggleCheckPasswordVisibility() {
    this.checkPasswordVisible = !this.checkPasswordVisible;
    const passwordInput = document.getElementById('check-password') as HTMLInputElement;
    if (this.checkPasswordVisible) passwordInput.type = 'text';
    else passwordInput.type = 'password';
  }
}
