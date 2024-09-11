import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { User } from '../../entity/user.entity';
import { Todo } from '../../entity/todo.entity';
import { TodoService } from '../../services/todo.service';
import { fixDate } from '../../utils/functions/fixDate';

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
  @Output() deleteSuccess: EventEmitter<void> = new EventEmitter();
  @Output() edit = new EventEmitter<Todo>(); // Cambia il tipo da string a Todo
  @ViewChild('todoItem') todoItem!: ElementRef; // Riferimento all'elemento DOM
  // Variables
  token = localStorage.getItem('token');
  userObj = localStorage.getItem('user');
  user: User = JSON.parse(this.userObj!);
  fullName: string = '';
  useDefaultAvatar: boolean = false;

  ngOnInit(): void {
    if (this.todo.dueDate) this.todo.dueDate = fixDate(this.todo.dueDate);
    this.todo.creationDate = fixDate(this.todo.creationDate!, true);
  }

  ngAfterViewInit() {
    this.fixHeigth();
  }

  fixHeigth() {
    const normalHeight = this.todoItem.nativeElement.offsetHeight;
    const actualHeight = this.todoItem.nativeElement.scrollHeight;
    if (actualHeight > normalHeight) {
      this.todoItem.nativeElement.style.height = `${actualHeight + 20}px`; //20 = altezza dei bottoni
    }
  }

  onToggleComplete() {
    const completed = !this.todo.completed;
    this.todoService.checkTodo(this.token!, this.todo.id!, completed).subscribe(
      (response) => {
        this.todo.completed = completed;
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
        this.deleteSuccess.emit(); // Emmette un evento quando l'eliminazione è riuscita
      },
      (error) => {
        console.error("Errore durante l'eliminazione del todo:", error);
      }
    );
  }

  onEdit() {
    this.edit.emit(this.todo);
  }
}
