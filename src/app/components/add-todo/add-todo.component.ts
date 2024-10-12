import { Component, EventEmitter, Output } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../entity/user.entity';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../entity/todo.entity';
import { JwtService } from '../../services/jwt.service';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrl: './add-todo.component.css',
})
export class AddTodoComponent {
  constructor(private userService: UserService, private todoService: TodoService, private jwtService: JwtService) {}
  @Output() close = new EventEmitter<void>();
  @Output() addTodo = new EventEmitter<any>();
  // Variabili
  token = this.jwtService.getToken();
  user = localStorage.getItem('user');
  users: User[] = [];
  assignedToId: string = '';
  // Variabili per la data minima -> a partire dal giorno successivo
  minDate: string = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];

  ngOnInit(): void {
    this.fixWidth();
    this.getUsers();
  }

  todo: Todo = {
    title: '',
    dueDate: undefined,
    completed: false,
    createdBy: this.getMe(),
    assignedTo: undefined, // Inizialmente undefined
  };

  async onSubmit(form: any) {
    if (form.invalid) {
      alert('Please fill in all required fields correctly.');
      return;
    }

    // Aspetta che l'utente assegnato venga recuperato
    const assignedToUser = this.getAssignedUser();
    this.todo.assignedTo = assignedToUser;

    // Ora esegui la chiamata per aggiungere il Todo
    this.todoService.addTodo(this.token!, this.todo).subscribe(
      (todo) => {
        this.addTodo.emit(todo);
        this.closePopup();
        //window.location.reload(); // Ricarica la pagina per visualizzare il nuovo todo
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

  getMe() {
    let meObj = JSON.parse(this.user!);
    let me: User = meObj;
    return me;
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

  fixWidth() {
    const inputElement = document.getElementById('dueDate') as HTMLInputElement;
    const submitButton = document.getElementById('assignedTo') as HTMLInputElement;

    const width = inputElement.offsetWidth;
    submitButton.style.width = `${width}px`;
  }

  closePopup() {
    this.close.emit();
  }
}
