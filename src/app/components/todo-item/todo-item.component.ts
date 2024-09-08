import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../entity/user.entity';
import { Todo } from '../../entity/todo.entity';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.css',
})
export class TodoItemComponent {
  constructor(private todoService: TodoService) {}
  @Input() todo!: Todo;
  @Output() delete = new EventEmitter<string>();
  @Output() toggleComplete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();
  token = localStorage.getItem('token');
  fullName: string = '';
  useDefaultAvatar: boolean = false;

  ngOnInit(): void {
    if (this.todo.dueDate) {
      this.todo.dueDate = this.fixDate(this.todo.dueDate);
    }
  }

  fixDate(todoDate: Date | string) {
    const date = new Date(todoDate);
    const day = String(date.getDate()).padStart(2, '0'); // Aggiungi uno zero iniziale se necessario
    const month = String(date.getMonth() + 1).padStart(2, '0'); // I mesi sono 0-indicizzati
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  onToggleComplete() {
    const checkboxComplete = document.getElementById(
      'completed'
    ) as HTMLInputElement;
    const completed = checkboxComplete.checked;

    this.todoService.checkTodo(this.token!, this.todo.id!, completed).subscribe(
      (response) => {
        this.todo.completed = completed; // Aggiorna localmente lo stato
      },
      (error) => {
        console.error('Errore durante il completamento del todo:', error);
      }
    );
  }

  getInitials(firstName: string, lastName: string): string {
    this.fullName = `${firstName} ${lastName}`;
    return firstName[0] + lastName[0];
  }

  showDefaultAvatar() {
    this.useDefaultAvatar = true;
  }

  onDelete() {
    this.todoService.delate(this.todo.id!, this.token!).subscribe(
      (response) => {
        window.location.reload(); // Ricarica la pagina
      },
      (error) => {
        console.error("Errore durante l'eliminazione del todo:", error);
      }
    );
  }

  onEdit() {
    this.edit.emit(this.todo.id);
  }
}
