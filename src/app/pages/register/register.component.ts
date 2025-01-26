import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { isValidUrl } from '../../utils/functions/validateUrl';
import { isValidEmail } from '../../utils/functions/validationEmail';
import { Title } from '@angular/platform-browser'; // Title service
import { RegisterData } from '../../entity/register.entity';
import { catchError, of } from 'rxjs';
import { SuccessPopupComponent } from '../../components/succes-popup/success-popup.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  constructor(private authService: AuthService, private router: Router, private titleSrv: Title) {}

  // Proprietà
  pageTitle = 'Register todo app';
  showSuccessAlert: boolean = false;
  pictureChoice: string = 'url'; // Opzione predefinita
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

  // Metodo onFileChange aggiornato per gestire il reset dell'immagine
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const img = new Image();
        img.src = e.target.result;

        img.onload = () => {
          // Calcoliamo il lato più corto tra larghezza e altezza
          const size = Math.min(img.width, img.height);
          const offsetX = (img.width - size) / 2; // Ritaglio orizzontale
          const offsetY = (img.height - size) / 2; // Ritaglio verticale

          // Creiamo un canvas per il ritaglio circolare
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = size;
          canvas.height = size;

          // Disegniamo il cerchio
          ctx?.beginPath();
          ctx?.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
          ctx?.clip();

          // Disegniamo l'immagine all'interno del cerchio
          ctx?.drawImage(img, offsetX, offsetY, size, size, 0, 0, size, size);

          // Convertiamo il risultato del canvas in base64
          this.registerData.picture = canvas.toDataURL();
        };
      };

      reader.readAsDataURL(file);
    } else {
      this.registerData.picture = ''; // Reset se non c'è nessun file
    }
  }

  onUrlChange() {
    if (this.registerData.picture) {
      const img = new Image();
      img.src = this.registerData.picture;

      img.onload = () => {
        const size = Math.min(img.width, img.height);
        const offsetX = (img.width - size) / 2; // Ritaglio orizzontale
        const offsetY = (img.height - size) / 2; // Ritaglio verticale

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = size;
        canvas.height = size;

        ctx?.beginPath();
        ctx?.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
        ctx?.clip();

        ctx?.drawImage(img, offsetX, offsetY, size, size, 0, 0, size, size);

        this.registerData.picture = canvas.toDataURL();
      };

      img.onerror = () => {
        console.error('Invalid image URL');
        this.validUrlPicture = false;
      };
    }
  }

  // Metodo di reset per 'No Photo'
  resetPicture() {
    this.registerData.picture = '';
  }

  // Metodo per validare l'URL dell'immagine
  validateUrlPicture() {
    //this.validUrlPicture = isValidUrl(this.registerData.picture);
    this.validUrlPicture = true;
  }

  // Metodo per validare l'email
  validateEmailUsername() {
    this.validEmailUsername = isValidEmail(this.registerData.username);
  }

  // Metodo per la registrazione
  async register(form: NgForm) {
    this.validateUrlPicture();
    this.validateEmailUsername();

    const condition =
      form.valid &&
      this.validUrlPicture &&
      this.validEmailUsername &&
      this.checkPassword === this.registerData.password;

    if (condition) {
      this.authService
        .register(this.registerData)
        .pipe(
          catchError((err) => {
            console.error('Errore di registrazione:', err);
            return of(null);
          })
        )
        .subscribe({
          next: () => {
            this.showSuccessAlert = true; // Mostra il popup
          },
          error: (err) => {
            console.error("Errore nell'invio dei dati:", err);
          },
        });
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

  closeAlert() {
    this.showSuccessAlert = false;
    setTimeout(() => {}, 5000);
    console.log('Redirecting to dashboard...');
    this.router.navigate(['/signin']);
  }
}
