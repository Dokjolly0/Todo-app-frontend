import { Component } from '@angular/core';
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
  showUncompletedOnly = false; // La checkbox è di default falsa (mostra tutti)

  ngOnInit(): void {
    // Alla prima visualizzazione, carica tutti i todo (completati e non)
    this.getTodo(false).then((todos) => {
      this.todos = todos;
    });
  }

  // Recupera i todo basati sul valore della checkbox
  getTodo(showUncompletedOnly: boolean) {
    // Se showUncompletedOnly è true, vogliamo solo gli incompleti
    // Altrimenti, vogliamo tutti i todo
    return this.todoService
      .getTodo(this.token!, !showUncompletedOnly)
      .toPromise();
  }

  // Gestisce la ricerca
  handleSearchChange(searchTerm: string) {
    if (searchTerm.trim() === '') {
      this.getTodo(this.showUncompletedOnly).then((todos) => {
        this.todos = todos;
      });
      return;
    }
    this.todoService.getTodoByTitle(this.token!, searchTerm).subscribe(
      (todos: Todo[]) => {
        this.todos = todos;
      },
      (error: any) => {
        console.error('Errore durante la ricerca dei todos:', error);
      }
    );
  }

  // Gestisce il cambiamento della checkbox
  handleIncompleteFilterChange(showIncompleteOnly: boolean) {
    this.showUncompletedOnly = showIncompleteOnly;
    // Carica i todo basati sul valore della checkbox
    this.getTodo(this.showUncompletedOnly).then((todos) => {
      console.log(
        'Todos caricati:',
        todos,
        'showIncompleteOnly:',
        showIncompleteOnly
      );
      this.todos = todos;
    });
  }

  openPopup() {
    this.addTodoPopup = true;
  }

  closePopup() {
    this.addTodoPopup = false;
  }

  handleAddTodo(todo: any) {
    this.todos.push(todo);
  }
}

// getTodo() {
//   // const token = this.token;

//   // this.todoService.getTodo(token!, true).subscribe(
//   //   (response: Todo[]) => {
//   //     this.todos = response;
//   //   },
//   //   (error: any) => {
//   //     console.error('Errore durante il recupero dei todo:', error);
//   //   }
//   // );

//   return this.todoService.getTodo(this.token!, true).toPromise();
// }

// ngOnInit(): void {
//   // this.getTodo();
//   // console.log('Dashboard: ' + this.todos);
//   this.getTodo().then((todos) => {
//     //console.log('Todos caricati:', todos);
//     this.todos = todos;
//   });
// }
