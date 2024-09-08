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
  constructor(private todoService: TodoService) {}
  @Input() todos: Todo[] = [];
  @Output() searchChange = new EventEmitter<string>(); // EventEmitter di tipo string
  token = localStorage.getItem('token');
  actualTodos: Todo[] = [];
  inputSearch: string = '';
  showIncompleteOnly: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['todos']) {
      this.actualTodos = this.todos;
    }
  }

  onSearchChange() {
    this.searchChange.emit(this.inputSearch); // Emmetti il valore della ricerca come stringa
  }

  // onSearchChange(inputSearch: string) {
  //   if (this.inputSearch.trim() === '') {
  //     this.actualTodos = this.todos; // Mostra tutti i todos se la ricerca è vuota
  //     return;
  //   }

  //   // this.todoService.getTodoByTitle(this.token!, this.inputSearch).subscribe(
  //   //   (todos: Todo[]) => {
  //   //     this.actualTodos = todos;
  //   //   },
  //   //   (error: any) => {
  //   //     console.error('Errore durante la ricerca dei todos:', error);
  //   //   }
  //   // );
  // }
}
