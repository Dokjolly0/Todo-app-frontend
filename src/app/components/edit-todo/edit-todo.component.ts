import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Todo } from '../../entity/todo.entity';
import { TodoService } from '../../services/todo.service';
import { User } from '../../entity/user.entity';
import { NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { switchMap } from 'rxjs/operators';
import { fixDate } from '../../utils/functions/fixDate';

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
    // Variabile per tenere traccia dell'observable che eseguirà l'operazione di aggiornamento del todo
    let todoUpdate$;
    if (this.todo.assignedTo !== undefined && this.assignedToId !== '') {
      this.todo.assignedTo!.id! = this.assignedToId;
      // Crea un observable per l'aggiornamento del todo
      todoUpdate$ = this.todoService.updateTodo(this.token!, this.todo);
    } else if (this.todo.assignedTo !== undefined && this.assignedToId === '') {
      this.todo.assignedTo = undefined;
      todoUpdate$ = this.todoService.updateTodo(this.token!, this.todo);
    } else {
      // Crea un observable per il recupero dell'utente assegnato al todo
      todoUpdate$ = this.userService.getUserById(this.token!, this.assignedToId).pipe(
        // Quando la chiamata a getUserById è completata, utilizza switchMap per passare al prossimo observable
        switchMap((user: User) => {
          this.todo.assignedTo = user;
          return this.todoService.updateTodo(this.token!, this.todo);
        })
      );
    }

    // Gestisce il risultato finale dell'observable
    todoUpdate$.subscribe(
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
