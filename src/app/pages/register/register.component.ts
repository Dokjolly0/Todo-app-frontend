import { Component, SimpleChanges } from '@angular/core';
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
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(private authService: AuthService, private router: Router, private titleSrv: Title) {}

  // Proprietà
  pageTitle = 'Register todo app';
  showSuccessAlert: boolean = false;
  pictureChoice: string = 'url'; // Opzione predefinita
  errorMessages: string[] = [];
  registerData: RegisterData = this.resetRegisterData();
  checkPassword: string = '';
  passwordVisible: boolean = false;
  passwordCheckVisible: boolean = false;
  validUrlPicture: boolean = true;
  validEmailUsername: boolean = true;
  isvalidPicture: boolean = false;
  formSubmitted: boolean = false;

  ngOnInit(): void {
    this.titleSrv.setTitle(this.pageTitle);
  }

  private resetRegisterData(): RegisterData {
    return {
      firstName: '',
      lastName: '',
      picture: '',
      username: '',
      password: '',
    };
  }

  /**
   * Metodo per il caricamento delle immagini da file.
   */
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
          this.validateEmailUsername();
        };
      };

      reader.readAsDataURL(file);
    } else {
      this.registerData.picture = ''; // Reset se non c'è nessun file
      this.validateEmailUsername();
    }
  }

  /**
   * Metodo per il caricamento delle immagini da URL.
   */
  async onUrlChange() {
    if (this.registerData.picture) {
      this.isvalidPicture = await isValidUrl(this.registerData.picture); // Controlla se l'immagine è valida
      if (!this.isvalidPicture) {
        this.validUrlPicture = false;
        return; // Interrompi l'esecuzione se l'URL non è valido
      }

      this.validUrlPicture = true; // Se l'URL è valido, procedi
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
        this.validateEmailUsername();
      };

      img.onerror = () => {
        console.error('Invalid image URL');
        this.validUrlPicture = false;
        this.validateEmailUsername();
      };
    }
  }

  resetPicture() {
    this.registerData.picture = '';
  }

  async validateUrlPicture() {
    this.validUrlPicture = await isValidUrl(this.registerData.picture);
  }

  // Metodo per validare l'email
  validateEmailUsername() {
    this.validEmailUsername = isValidEmail(this.registerData.username);
  }

  updateErrorMessages() {
    if (!this.formSubmitted) {
      return; // Se il modulo non è stato inviato, non aggiornare gli errori
    }

    // Funzione di utilità per aggiungere un errore solo se non è già presente
    const addErrorIfNotExists = (error: string) => {
      if (!this.errorMessages.includes(error)) {
        this.errorMessages.push(error);
      }
    };

    this.errorMessages = []; // Resetta gli errori ad ogni aggiornamento

    // Verifica i campi dinamicamente
    if (!this.registerData.firstName) {
      addErrorIfNotExists('Name is required');
    }

    if (!this.registerData.lastName) {
      addErrorIfNotExists('Surname is required');
    }

    if (!this.registerData.username || !this.validEmailUsername) {
      addErrorIfNotExists('Username is required and must be a valid email');
    }

    if (!this.registerData.password || this.registerData.password.length < 8) {
      addErrorIfNotExists('Password must be at least 8 characters');
    }

    if (this.checkPassword !== this.registerData.password) {
      addErrorIfNotExists('Passwords do not match');
    }

    if (this.checkPassword.length < 8) {
      addErrorIfNotExists('Password confirmation must be at least 8 characters');
    }

    if (!this.validUrlPicture && this.pictureChoice !== 'none') {
      addErrorIfNotExists('Invalid image URL');
    }

    // Verifica immagine solo se non è selezionata l'opzione "No Photo"
    if (this.pictureChoice !== 'none') {
      if (!this.validUrlPicture) {
        addErrorIfNotExists('Invalid image URL');
      }

      if (!this.registerData.picture) {
        addErrorIfNotExists('Please upload a photo or select "No Photo".');
      }
    }
  }

  // Metodo per la registrazione
  async register(form: NgForm) {
    this.formSubmitted = true; // Indica che il modulo è stato inviato
    this.errorMessages = []; // Resetta gli errori all'inizio

    await this.validateUrlPicture(); // Attendi la validazione dell'URL
    this.validateEmailUsername();
    this.updateErrorMessages(); // Aggiungi gli errori alla lista

    if (form.valid && this.errorMessages.length === 0) {
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
    this.router.navigate(['/signin']);
  }
}

// fixFormHeight(): void {
//   setTimeout(() => {
//     const registerBox = document.querySelector('.register-box') as HTMLElement;
//     const formHeight = registerBox.offsetHeight;
//     console.log('Form height:', formHeight);
//     if (formHeight >= 880) {
//       registerBox.style.marginTop = '300px';
//       console.log('1. Form height:', formHeight);
//     } else if (formHeight >= 860 && formHeight < 880) {
//       registerBox.style.marginTop = '280px';
//       console.log('2. Form height:', formHeight);
//     } else if (formHeight >= 835 && formHeight < 860) {
//       registerBox.style.marginTop = '255px';
//       console.log('3. Form height:', formHeight);
//     } else if (formHeight >= 790 && formHeight < 835) {
//       registerBox.style.marginTop = '210px';
//       console.log('4. Form height:', formHeight);
//     }
//   }, 0); // Ritarda di 0ms per aspettare il completamento del ciclo di rendering
// }
