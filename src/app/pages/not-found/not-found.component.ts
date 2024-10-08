import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser'; // Title service
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
})
export class NotFoundComponent {
  pageTitle = 'Page not found';
  isAuthenticated: boolean;
  constructor(private titleSrv: Title, private authService: AuthService) {
    this.isAuthenticated = this.authService.isLoggedIn();
  }

  ngOnInit(): void {
    this.titleSrv.setTitle(this.pageTitle);
  }

  get redirectUrl() {
    return this.isAuthenticated ? '/app/dashboard' : '/signin';
  }

  get redirectText() {
    return this.isAuthenticated ? 'Torna alla Dashboard' : 'Torna al Login';
  }
}
