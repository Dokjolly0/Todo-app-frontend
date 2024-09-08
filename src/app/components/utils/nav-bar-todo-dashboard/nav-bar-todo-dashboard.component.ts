import { Component, Input, SimpleChanges } from '@angular/core';
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
  token = localStorage.getItem('token');
  actualTodos: Todo[] = [];
  inputSearch: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['todos']) {
      this.actualTodos = this.todos;
    }
  }

  onSearchChange(inputSearch: string) {
    if (this.inputSearch.trim() === '') {
      this.actualTodos = this.todos; // Mostra tutti i todos se la ricerca è vuota
      return;
    }

    // this.todoService.getTodoByTitle(this.token!, this.inputSearch).subscribe(
    //   (todos: Todo[]) => {
    //     this.actualTodos = todos;
    //   },
    //   (error: any) => {
    //     console.error('Errore durante la ricerca dei todos:', error);
    //   }
    // );
  }
}
