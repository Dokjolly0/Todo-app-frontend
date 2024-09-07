import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../entity/user.entity';
import { Todo } from '../../entity/todo.entity';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.css',
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Output() delete = new EventEmitter<string>();
  @Output() toggleComplete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();

  onDelete() {
    this.delete.emit(this.todo.id);
  }

  onToggleComplete() {
    this.toggleComplete.emit(this.todo.id);
  }

  onEdit() {
    this.edit.emit(this.todo.id);
  }
}
