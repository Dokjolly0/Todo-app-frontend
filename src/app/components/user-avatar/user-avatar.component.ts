import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../entity/user.entity';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.css'],
})
export class UserAvatarComponent implements OnInit {
  @Input() user: User = {
    firstName: '',
    lastName: '',
    fullName: '',
    picture: '',
  };
  @Input() size: number = 32;
  // Variables
  userInitials: string = ''; // Iniziali nome e cognome
  useDefaultAvatar: boolean = false; // Controlla se mostrare le iniziali invece dell'immagine

  ngOnInit() {
    if (!this.user.picture) this.useDefaultAvatar = true;
    this.userInitials = this.getInitials(this.user.firstName, this.user.lastName);
  }

  getInitials(firstName: string, lastName: string): string {
    return firstName[0] + lastName[0];
  }

  showDefaultAvatar() {
    this.useDefaultAvatar = true;
  }
}
