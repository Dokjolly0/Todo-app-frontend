import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../entity/user.entity';
import { Todo } from '../../entity/todo.entity';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent {
  constructor(private authService: AuthService, private router: Router) {}
  @Input() todos!: Todo[];
  fullName: string = '';
  userInitials: string = ''; //Variabile che controlla le iniziali di nome e cognome
  isDropdownOpen: boolean = false; //Variabile che permette di controllare se il menu è aperto o chiuso
  useDefaultAvatar: boolean = false;
  @Output() searchChange = new EventEmitter<string>();
  user: User = {
    firstName: '',
    lastName: '',
    fullName: '',
    picture: '',
  };

  ngOnInit() {
    this.user = this.authService.getUser();
    if (!this.user.picture) this.useDefaultAvatar = true;
    this.userInitials = this.getInitials(
      this.user.firstName,
      this.user.lastName
    );
  }

  getInitials(firstName: string, lastName: string): string {
    this.fullName = `${firstName} ${lastName}`;
    return firstName[0] + lastName[0];
  }

  showDefaultAvatar() {
    this.useDefaultAvatar = true;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    //Se cliccata, inverte isDropdownOpen
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['signin']);
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-section')) {
      this.isDropdownOpen = false;
    }
  }

  forwardSearchChange(searchTerm: string) {
    this.searchChange.emit(searchTerm); // Passa il valore di ricerca al componente padre
  }
}
