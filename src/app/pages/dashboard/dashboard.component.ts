import { Component, AfterViewInit } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { AuthService } from '../../services/auth.service';
import { Todo } from '../../entity/todo.entity';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  constructor(
    private todoService: TodoService,
    private authService: AuthService
  ) {}
  addTodoPopup = false;
  todos: Todo[] = [];
  token = this.authService.getToken();

  ngOnInit(): void {
    // this.getTodo();
    // console.log('Dashboard: ' + this.todos);
    this.getTodo().then((todos) => {
      console.log('Todos caricati:', todos);
      this.todos = todos;
    });
  }

  ngOnChanges(): void {
    this.getTodo();
  }

  ngAfterViewInit() {
    // Usa `ngAfterViewInit` per assicurarti che il DOM sia completamente carico
    document.querySelector('.add-todo-btn')?.addEventListener('click', () => {
      this.openPopup();
    });
  }

  getTodo() {
    // const token = this.token;

    // this.todoService.getTodo(token!, true).subscribe(
    //   (response: Todo[]) => {
    //     this.todos = response;
    //   },
    //   (error: any) => {
    //     console.error('Errore durante il recupero dei todo:', error);
    //   }
    // );

    return this.todoService.getTodo(this.token!, true).toPromise();
  }

  openPopup() {
    this.addTodoPopup = true;
  }

  closePopup() {
    this.addTodoPopup = false;
  }

  handleAddTodo(todo: any) {
    this.todos.push(todo);
    //console.log('Todo aggiunto:', todo);
  }
}
