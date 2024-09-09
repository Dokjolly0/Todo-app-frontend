import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { User } from '../../entity/user.entity';
import { Todo } from '../../entity/todo.entity';
import { TodoService } from '../../services/todo.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.css',
})
export class TodoItemComponent {
  constructor(
    private todoService: TodoService,
    private userService: UserService
  ) {}
  @Input() todo!: Todo;
  @Output() delete = new EventEmitter<string>();
  @Output() toggleComplete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();
  @ViewChild('todoItem') todoItem!: ElementRef; // Riferimento all'elemento DOM
  token = localStorage.getItem('token');
  userObj = localStorage.getItem('user');
  user: User = JSON.parse(this.userObj!);
  fullName: string = '';
  useDefaultAvatar: boolean = false;

  ngOnInit(): void {
    if (this.todo.dueDate) {
      this.todo.dueDate = this.fixDate(this.todo.dueDate);
    }
    this.todo.creationDate = this.fixDate(this.todo.creationDate!, true);
  }

  ngAfterViewInit() {
    this.fixHeigth();
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

  fixHeigth() {
    const normalHeight = this.todoItem.nativeElement.offsetHeight;
    const actualHeight = this.todoItem.nativeElement.scrollHeight;
    if (actualHeight > normalHeight) {
      this.todoItem.nativeElement.style.height = `${actualHeight + 20}px`; //20 = altezza dei bottoni
    }
  }

  onToggleComplete() {
    // Inverti lo stato attuale del todo
    const completed = !this.todo.completed;

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
