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
  constructor(
    private authService: AuthService,
    private router: Router,
    private titleSrv: Title
  ) {}
  //Property
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

  //OnInit
  ngOnInit(): void {
    this.fixWidth();
    this.titleSrv.setTitle(this.pageTitle);
  }

  //Method
  register(form: NgForm) {
    this.validUrlPicture = isValidUrl(this.registerData.picture);
    this.validEmailUsername = isValidEmail(this.registerData.username);
    if (form.valid && this.validUrlPicture && this.validEmailUsername) {
      this.authService.register(this.registerData).subscribe(
        (res) => {
          this.router.navigate(['/signin']);
        },
        (err) => console.log(err)
      );
    }
  }

  fixWidth() {
    const inputElement = document.getElementById('password') as HTMLInputElement;
    const submitButton = document.getElementById('submit') as HTMLInputElement;
    const width = inputElement.offsetWidth;
    submitButton.style.width = `${width}px`;
  }

  getErrorMessages(): string {
    const messages = [];
    if (this.checkPassword === '') messages.push('Please confirm your password');
    if (this.checkPassword !== this.registerData.password)
      messages.push('Passwords do not match');
    if (this.checkPassword.length < 8)
      messages.push('Password lenght must be at least 8 character');
    return messages.join('   &   ');
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
