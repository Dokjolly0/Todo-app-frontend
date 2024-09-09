import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Todo } from '../../entity/todo.entity';
import { TodoService } from '../../services/todo.service';
import { User } from '../../entity/user.entity';
import { NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-edit-todo',
  templateUrl: './edit-todo.component.html',
  styleUrls: ['./edit-todo.component.css'],
})
export class EditTodoComponent {
  constructor(private userService: UserService, private todoService: TodoService) {}
  @Input() todo!: Todo;
  token = localStorage.getItem('token');
  @Input() users: User[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Todo>();
  minDate: string = new Date().toISOString().split('T')[0]; // Imposta la data minima per il campo di scadenza

  //Variable
  assignedToId: string = ''; // Aggiungi questa proprietà

  ngOnInit(): void {
    this.getUsers();
  }

  fixDate(todoDate: Date | string, clock: boolean = false): string {
    const date = new Date(todoDate);
    const day = String(date.getDate()).padStart(2, '0'); // Usa getDate per il tempo locale
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Usa getMonth per il tempo locale
    const year = date.getFullYear(); // Usa getFullYear per il tempo locale
    if (clock) {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${day}/${month}/${year} - ${hours}:${minutes}`;
    }
    //console.log(`${day}/${month}/${year} -> ${todoDate}`);
    return `${day}/${month}/${year}`;
  }

  onSubmit(form: NgForm) {
    if (this.assignedToId !== '') this.todo.assignedTo!.id = this.assignedToId;
    this.todoService.updateTodo(this.token!, this.todo).subscribe(
      (updatedTodo) => {
        this.todo.dueDate;
        this.save.emit();
        this.closePopup();
      },
      (error: any) => {
        console.error("Errore durante l'aggiornamento del todo", error);
      }
    );
  }

  getUsers() {
    this.userService.getUserList(this.token!).subscribe(
      (users: User[]) => {
        this.users = users;
      },
      (error: any) => {
        console.error('Errore durante il recupero degli utenti', error);
      }
    );
  }

  closePopup() {
    this.close.emit(); // Notifica il componente padre
  }
}
