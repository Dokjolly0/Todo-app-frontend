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
  constructor(private todoService: TodoService, private authService: AuthService, private titleSrv: Title) {}
  pageTitle = 'Dashboard';
  addTodoPopup = false;
  editTodoPopup = false;
  selectedTodo!: Todo;
  todos: Todo[] = [];
  token = this.authService.getToken();
  showUncompletedOnly = true; // Di default, mostra solo i non completati (checkbox fleggata)

  ngOnInit(): void {
    this.titleSrv.setTitle(this.pageTitle);
    // Alla prima visualizzazione, carica solo i todo non completati
    this.getTodo(!this.showUncompletedOnly).then((todos) => {
      this.todos = todos;
    });
    // Aggiunge un event listener al bottone per mostrare l'add component popup
    document.getElementById('add-todo-btn')?.addEventListener('click', () => {
      this.addTodoPopup = !this.addTodoPopup;
    });
  }

  // Ritornerà una Promise contenente i todo (showUncompletedOnly true = solo i non completati, false = tutti)
  getTodo(showUncompletedOnly: boolean) {
    return this.todoService.getTodo(this.token!, showUncompletedOnly).toPromise();
  }

  // Navbar component
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

  // Navbar component
  handleIncompleteFilterChange() {
    this.showUncompletedOnly = !this.showUncompletedOnly; // Cambia il valore in base allo stato della checkbox
    // Carica i todo basati sul valore della checkbox
    this.getTodo(!this.showUncompletedOnly).then((todos) => {
      this.todos = todos;
    });
  }

  // Todo item
  handleDeleteSuccess() {
    this.getTodo(!this.showUncompletedOnly).then((todos) => {
      this.todos = todos;
    });
  }

  // Add component popup
  openPopup() {
    this.addTodoPopup = true;
  }
  closePopup() {
    this.addTodoPopup = false;
  }
  handleAddTodo(todo: any) {
    this.todos.push(todo);
  }

  // Edit component popup
  onEditTodo(todo: Todo) {
    this.selectedTodo = todo; // Imposta il todo selezionato per la modifica
    this.editTodoPopup = true; // Mostra il popup di modifica
  }
  closeEditPopup() {
    this.editTodoPopup = false; // Chiude il popup di modifica
  }
  handleEditTodoSave(todo: Todo) {
    this.getTodo(!this.showUncompletedOnly).then((todos) => {
      this.todos = todos;
    });
    this.closeEditPopup(); // Chiude il popup di modifica
  }
}
