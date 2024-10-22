import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-email-failed',
  templateUrl: './confirm-email-failed.component.html',
  styleUrl: './confirm-email-failed.component.css',
})
export class ConfirmEmailFailedComponent {
  constructor(private router: Router) {}

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
