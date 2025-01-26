import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../services/user.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { JwtService } from '../../services/jwt.service';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.css'],
})
export class UserAvatarComponent implements OnInit, OnDestroy {
  @Input() user: any = {
    firstName: '',
    lastName: '',
    fullName: '',
    picture: '',
  };
  @Input() size: number = 32;
  userInitials: string = ''; // Iniziali nome e cognome
  useDefaultAvatar: boolean = false; // Controlla se mostrare le iniziali invece dell'immagine
  userPictureUrl: SafeUrl | null = null; // URL sicuro per mostrare l'immagine
  refreshInterval: any; // Memorizza l'intervallo per il refresh

  constructor(private userService: UserService, private sanitizer: DomSanitizer, private jwtSrv: JwtService) {}

  ngOnInit() {
    if (this.user) {
      if (!this.user.picture) {
        this.useDefaultAvatar = true;
      }
      this.userInitials = this.getInitials(this.user.firstName, this.user.lastName);
      this.loadUserPicture();
    }

    // Imposta un intervallo per aggiornare l'immagine ogni 5 secondi
    this.refreshInterval = setInterval(() => {
      this.loadUserPicture();
    }, 500);
  }

  ngOnDestroy() {
    // Cancella l'intervallo quando il componente viene distrutto
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  getInitials(firstName: string, lastName: string): string {
    return (firstName[0] || '') + (lastName[0] || '');
  }

  loadUserPicture() {
    const token = this.jwtSrv.getToken(); // Recupera il token dal localStorage
    if (token) {
      this.userService.getUserPicture(token).subscribe(
        (response) => {
          // Crea un URL sicuro per il blob dell'immagine
          this.userPictureUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(response));
        },
        (error) => {
          console.error("Errore nel recupero dell'immagine:", error);
          this.useDefaultAvatar = true; // Mostra l'avatar predefinito in caso di errore
        }
      );
    }
  }

  showDefaultAvatar() {
    this.useDefaultAvatar = true;
  }
}
