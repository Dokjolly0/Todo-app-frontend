import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  email: string = '';

  constructor(private router: Router) {}

  recoverPassword() {
    // Logica per il recupero password (invio di un'email di recupero)
    console.log('Recupero password per:', this.email);
    
    // Puoi anche navigare a una pagina di conferma o avviso
    this.router.navigate(['/password-recovery-confirmation']);
  }
}
