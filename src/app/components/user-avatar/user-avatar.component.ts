import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { UserService } from '../../services/user.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { JwtService } from '../../services/jwt.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.css'],
})
export class UserAvatarComponent implements OnInit, OnDestroy, OnChanges {
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
  private pictureSubscription: Subscription | null = null; // Per gestire eventuali osservabili

  constructor(private userService: UserService, private sanitizer: DomSanitizer, private jwtSrv: JwtService) {}

  ngOnInit() {
    this.initializeAvatar();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user']) {
      this.initializeAvatar(); // Ricalcola avatar quando cambia il valore dell'input user
    }
  }

  ngOnDestroy() {
    this.cleanUpSubscriptions(); // Pulisce eventuali sottoscrizioni
  }

  initializeAvatar() {
    this.userInitials = this.getInitials(this.user.firstName, this.user.lastName);
    this.useDefaultAvatar = !this.user.picture; // Usa l'avatar di default se non c'è l'immagine

    // Carica l'immagine utente se disponibile
    if (this.user.picture) {
      this.loadUserPicture();
    }
  }

  getInitials(firstName: string, lastName: string): string {
    return (firstName[0] || '') + (lastName[0] || '');
  }

  loadUserPicture() {
    const token = this.jwtSrv.getToken(); // Recupera il token dal localStorage
    if (token) {
      this.cleanUpSubscriptions(); // Pulisce eventuali sottoscrizioni precedenti

      this.pictureSubscription = this.userService.getUserPicture(token).subscribe(
        (response) => {
          // Crea un URL sicuro per il blob dell'immagine
          this.userPictureUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(response));
          this.useDefaultAvatar = false;
        },
        (error) => {
          console.error("Errore nel recupero dell'immagine:", error);
          this.useDefaultAvatar = true; // Mostra l'avatar predefinito in caso di errore
        }
      );
    }
  }

  cleanUpSubscriptions() {
    if (this.pictureSubscription) {
      this.pictureSubscription.unsubscribe();
      this.pictureSubscription = null;
    }
  }

  showDefaultAvatar() {
    this.useDefaultAvatar = true;
  }
}
