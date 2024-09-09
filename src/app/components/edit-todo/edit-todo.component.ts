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

  onSubmit(form: NgForm) {
    console.log(this.todo);
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
