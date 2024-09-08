import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Todo } from '../../../entity/todo.entity';
import { TodoService } from '../../../services/todo.service';

@Component({
  selector: 'app-nav-bar-todo-dashboard',
  templateUrl: './nav-bar-todo-dashboard.component.html',
  styleUrl: './nav-bar-todo-dashboard.component.css',
})
export class NavBarTodoDashboardComponent {
  @Input() todos: Todo[] = [];
  @Output() searchChange = new EventEmitter<string>(); // EventEmitter di tipo string
  @Output() incompleteFilterChange = new EventEmitter<boolean>(); // Per il filtro incompleti
  inputSearch: string = '';
  showIncompleteOnly: boolean = true; // Checkbox di default true (mostra solo incompleti)

  onSearchChange() {
    // if (this.showIncompleteOnly) {
    //   this.showIncompleteOnly = false;
    //   this.incompleteFilterChange.emit(this.showIncompleteOnly); // Emetti il nuovo stato della checkbox
    // }
    this.searchChange.emit(this.inputSearch); // Emmetti il valore della ricerca come stringa
  }

  onIncompleteFilterChange() {
    this.incompleteFilterChange.emit(this.showIncompleteOnly); // Emetti solo lo stato del checkbox
  }
}
