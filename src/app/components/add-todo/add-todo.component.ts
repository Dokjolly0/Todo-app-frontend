import { Component, EventEmitter, Output } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../entity/user.entity';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../entity/todo.entity';
import { JwtService } from '../../services/jwt.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrl: './add-todo.component.css',
})
export class AddTodoComponent {
  constructor(
    private userService: UserService,
    private todoService: TodoService,
    private jwtService: JwtService,
    private authService: AuthService,
    private router: Router
  ) {}
  @Output() close = new EventEmitter<void>();
  @Output() addTodo = new EventEmitter<any>();
  // Variabili
  token = this.jwtService.getToken();
  currentUser: User = undefined!;
  users: User[] = [];
  assignedToId: string = '';
  minDate: string = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (user) this.currentUser = user;
    });
    this.getUsers();
  }

  todo: Todo = {
    title: '',
    dueDate: undefined,
    completed: false,
    createdBy: this.currentUser,
    assignedTo: undefined,
  };

  async onSubmit(form: any) {
    if (form.invalid) {
      alert('Please fill in all required fields correctly.');
      return;
    }

    const assignedToUser = this.getAssignedUser();
    this.todo.assignedTo = assignedToUser;
    this.todoService.addTodo(this.token!, this.todo).subscribe(
      (todo) => {
        this.addTodo.emit(todo);
        this.closePopup();
      },
      (error) => {
        console.error("Errore durante l'aggiunta del todo", error);
      }
    );
  }

  getAssignedUser() {
    let assignedToUser;
    for (let user of this.users) {
      if (user.id === this.assignedToId) assignedToUser = user;
      else continue;
    }
    return assignedToUser;
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
    this.close.emit();
  }
}
