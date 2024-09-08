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
      this.todo.creationDate = this.fixDate(this.todo.creationDate!);
    }
  }

  fixDate(todoDate: Date | string) {
    const date = new Date(todoDate);
    const day = String(date.getDate()).padStart(2, '0'); // Usa getDate per il tempo locale
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Usa getMonth per il tempo locale
    const year = date.getFullYear(); // Usa getFullYear per il tempo locale
    //console.log(`${day}/${month}/${year} -> ${todoDate}`);
    return `${day}/${month}/${year}`;
  }

  onToggleComplete() {
    // Inverti lo stato attuale del todo
    const completed = !this.todo.completed;

    this.todoService.checkTodo(this.token!, this.todo.id!, completed).subscribe(
      (response) => {
        this.todo.completed = completed; // Aggiorna localmente lo stato
        console.log(`Todo fleggato ${completed}:`, response);
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
