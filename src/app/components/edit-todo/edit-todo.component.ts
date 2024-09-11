import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Todo } from '../../entity/todo.entity';
import { TodoService } from '../../services/todo.service';
import { User } from '../../entity/user.entity';
import { NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { switchMap } from 'rxjs/operators';
import { dateStringToIsoString } from '../../utils/functions/fixDate';

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
  isDueDateDisabled: boolean = false; // Inizialmente non disabilitato

  //Variable
  assignedToId: string = 'noSelection'; // Aggiungi questa proprietà

  ngOnInit(): void {
    this.getUsers();
  }

  onSubmit(form: NgForm) {
    //true -> è per l'input html
    if (this.todo.dueDate) {
      if (this.isDueDateDisabled) this.todo.dueDate = undefined;
      else this.todo.dueDate = dateStringToIsoString(this.todo.dueDate, true);
      console.log(this.todo.dueDate);
    }
    const logicAssign = () => {
      const condition1 = this.assignedToId === 'noSelection' && this.todo.assignedTo === undefined;
      const condition2 = this.assignedToId === 'noSelection' && this.todo.assignedTo !== undefined;
      const condition3 = this.assignedToId === 'removeAssign';
      // noSelection -> assignedTo uguale a prima
      // removeAssign -> assignedTo uguale a undefined
      if (condition1 || condition3) this.todo.assignedTo = undefined;
      else if (condition2) this.todo.assignedTo!.id = this.todo.assignedTo!.id;
      else this.todo.assignedTo!.id! = this.assignedToId;
    };

    // Variabile per tenere traccia dell'observable che eseguirà l'operazione di aggiornamento del todo
    let todoUpdate$;
    if (this.todo.assignedTo !== undefined) {
      logicAssign();
      // Crea un observable per l'aggiornamento del todo
      todoUpdate$ = this.todoService.updateTodo(this.token!, this.todo);
    } else if (this.todo.assignedTo === undefined && this.assignedToId !== 'noSelection') {
      // Crea un observable per il recupero dell'utente assegnato al todo
      todoUpdate$ = this.userService.getUserById(this.token!, this.assignedToId).pipe(
        // Quando la chiamata a getUserById è completata, utilizza switchMap per passare al prossimo observable
        switchMap((user: User) => {
          this.todo.assignedTo = user;
          return this.todoService.updateTodo(this.token!, this.todo);
        })
      );
    } else {
      todoUpdate$ = this.todoService.updateTodo(this.token!, this.todo);
    }

    // Gestisce il risultato finale dell'observable
    todoUpdate$.subscribe(
      (updatedTodo) => {
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
