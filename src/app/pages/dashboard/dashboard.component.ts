import { Component, SimpleChanges } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { AuthService } from '../../services/auth.service';
import { Todo } from '../../entity/todo.entity';
import { Title } from '@angular/platform-browser'; //Title service

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  constructor(
    private todoService: TodoService,
    private authService: AuthService,
    private titleSrv: Title
  ) {}
  pageTitle = 'Dashboard';
  addTodoPopup = false;
  editTodoPopup = false;
  selectedTodo!: Todo;
  todos: Todo[] = [];
  token = this.authService.getToken();
  showUncompletedOnly = true; // Di default, mostra solo i non completati (checkbox fleggata)

  ngOnInit(): void {
    this.titleSrv.setTitle(this.pageTitle);
    // Alla prima visualizzazione, carica tutti i todo (completati e non)
    this.getTodo(!this.showUncompletedOnly).then((todos) => {
      this.todos = todos;
    });

    document.getElementById('add-todo-btn')?.addEventListener('click', () => {
      this.addTodoPopup = !this.addTodoPopup;
    });
  }

  // Recupera i todo basati sul valore della checkbox
  getTodo(showUncompletedOnly: boolean) {
    // Se showUncompletedOnly è true, vogliamo solo gli incompleti // Altrimenti, vogliamo tutti i todo
    return this.todoService.getTodo(this.token!, showUncompletedOnly).toPromise();
  }

  // Gestisce la ricerca
  handleSearchChange(searchTerm: string) {
    if (searchTerm.trim() === '') {
      this.getTodo(!this.showUncompletedOnly).then((todos) => {
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
  handleIncompleteFilterChange() {
    this.showUncompletedOnly = !this.showUncompletedOnly; // Cambia il valore in base allo stato della checkbox
    // Carica i todo basati sul valore della checkbox
    this.getTodo(!this.showUncompletedOnly).then((todos) => {
      this.todos = todos;
    });
  }

  handleDeleteSuccess() {
    this.getTodo(!this.showUncompletedOnly).then((todos) => {
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

  // Metodo per gestire l'evento di modifica
  onEditTodo(todo: Todo) {
    this.selectedTodo = todo; // Imposta il todo selezionato per la modifica
    this.editTodoPopup = true; // Mostra il popup di modifica
  }

  // Metodo per chiudere il popup di modifica
  closeEditPopup() {
    this.editTodoPopup = false;
  }

  // Metodo per gestire il salvataggio delle modifiche
  handleEditTodoSave(todo: Todo) {
    this.getTodo(!this.showUncompletedOnly).then((todos) => {
      this.todos = todos;
    });
    this.closeEditPopup(); // Chiude il popup di modifica
  }
}
