import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
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
  @Input() todos!: Todo[];
  @Output() searchChange = new EventEmitter<string>();
  @Output() incompleteFilterChange = new EventEmitter<boolean>();

  fullName: string = '';
  userInitials: string = '';
  isDropdownOpen: boolean = false;
  useDefaultAvatar: boolean = false;
  inputSearch: string = '';
  showIncompleteOnly: boolean = true; // Checkbox di default true (mostra solo incompleti)

  user: User = {
    firstName: '',
    lastName: '',
    fullName: '',
    picture: '',
  };

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    if (!this.user.picture) this.useDefaultAvatar = true;
    this.userInitials = this.getInitials(this.user.firstName, this.user.lastName);
    this.fullName = `${this.user.firstName} ${this.user.lastName}`;
  }

  getInitials(firstName: string, lastName: string): string {
    return firstName[0] + lastName[0];
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
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

  onSearchChange() {
    this.searchChange.emit(this.inputSearch);
  }

  onIncompleteFilterChange() {
    this.incompleteFilterChange.emit(this.showIncompleteOnly);
  }
}