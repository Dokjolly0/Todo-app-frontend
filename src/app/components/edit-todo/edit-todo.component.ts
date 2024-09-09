import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Todo } from '../../entity/todo.entity';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-edit-todo',
  templateUrl: './edit-todo.component.html',
  styleUrls: ['./edit-todo.component.css'],
})
export class EditTodoComponent {
  @Input() todo!: Todo;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Todo>();

  constructor(private todoService: TodoService) {}

  onSubmit() {
    console.log(this.todo);
  }

  closePopup() {
    this.close.emit(); // Notifica il componente padre
  }
}
