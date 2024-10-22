import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './request-reset-password.component.html',
  styleUrl: './request-reset-password.component.css',
})
export class RequestResetPasswordComponent {
  email: string = '';
  requestState: boolean = false;
  errorMessage: string = ''; // Aggiungi una proprietà per gestire l'errore

  constructor(private router: Router, private userService: UserService) {}

  recoverPassword() {
    // Resetta il messaggio di errore ogni volta che si invia il form
    this.errorMessage = '';

    this.userService.requestResetPasswordWithEmail(this.email).subscribe(
      (res) => {
        this.requestState = true;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 5000); // 5000 millisecondi = 5 secondi
      },
      (err) => {
        if (err.status === 404) {
          // Errore 404 - Mail non trovata
          this.errorMessage = 'Email non trovata. Controlla la tua email e riprova.';
        } else {
          // Altri errori
          this.errorMessage = 'Si è verificato un errore. Riprova più tardi.';
        }
        console.log(err);
      }
    );
  }

  closeAlert() {
    this.requestState = false;
    this.router.navigate(['/login']);
  }
}
