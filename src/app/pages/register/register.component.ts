import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { isValidUrl } from '../../utils/functions/validateUrl';
import { isValidEmail } from '../../utils/functions/validationEmail';
import { Title } from '@angular/platform-browser'; // Title service
import { RegisterData } from '../../entity/register.entity';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  constructor(private authService: AuthService, private router: Router, private titleSrv: Title) {}

  // Proprietà
  pageTitle = 'Register todo app';
  registerData: RegisterData = {
    firstName: '',
    lastName: '',
    picture: '',
    username: '',
    password: '',
  };
  checkPassword: string = '';
  passwordVisible: boolean = false;
  passwordCheckVisible: boolean = false;
  validUrlPicture: boolean = true;
  validEmailUsername: boolean = true;

  // OnInit
  ngOnInit(): void {
    this.titleSrv.setTitle(this.pageTitle);
  }

  // Metodo per validare l'URL dell'immagine
  validateUrlPicture() {
    this.validUrlPicture = isValidUrl(this.registerData.picture);
  }

  // Metodo per validare l'email
  validateEmailUsername() {
    this.validEmailUsername = isValidEmail(this.registerData.username);
  }

  // Metodo per la registrazione
  register(form: NgForm) {
    this.validateUrlPicture();
    this.validateEmailUsername();
    if (
      form.valid &&
      this.validUrlPicture &&
      this.validEmailUsername &&
      this.checkPassword === this.registerData.password
    ) {
      this.authService.register(this.registerData).subscribe(
        (res) => {
          this.router.navigate(['/signin']);
        },
        (err) => console.log(err)
      );
    }
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    if (this.passwordVisible) passwordInput.type = 'text';
    else passwordInput.type = 'password';
  }

  toggleCheckPasswordVisibility() {
    this.passwordCheckVisible = !this.passwordCheckVisible;
    const passwordInput = document.getElementById('check-password') as HTMLInputElement;
    if (this.passwordCheckVisible) passwordInput.type = 'text';
    else passwordInput.type = 'password';
  }
}
