import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { JwtService } from '../../services/jwt.service';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.css'],
})
export class UserAvatarComponent implements OnInit {
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

  constructor(private userService: UserService, private sanitizer: DomSanitizer, private jwtSrv: JwtService) {}

  ngOnInit() {
    if (this.user) {
      if (!this.user.picture) {
        this.useDefaultAvatar = true;
      }
      this.userInitials = this.getInitials(this.user.firstName, this.user.lastName);
      this.loadUserPicture();
    }
  }

  getInitials(firstName: string, lastName: string): string {
    return (firstName[0] || '') + (lastName[0] || '');
  }

  loadUserPicture() {
    const token = this.jwtSrv.getToken(); // Recupera il token dal localStorage
    console.log('Token:', token);
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
