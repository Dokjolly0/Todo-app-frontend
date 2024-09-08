import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-edit-todo',
  templateUrl: './edit-todo.component.html',
  styleUrl: './edit-todo.component.css',
})
export class EditTodoComponent {
  persons: any[] = ['Ciao', 'Prova'];

  @Output() close = new EventEmitter<void>();
  @Output() addTodo = new EventEmitter<any>();

  ngOnInit(): void {
    this.fixWidth();
  }

  todo = {
    title: '',
    description: '',
    dueDate: '',
    assignee: '',
  };

  fixWidth() {
    const inputElement = document.getElementById('dueDate') as HTMLInputElement;
    const submitButton = document.getElementById(
      'assignee'
    ) as HTMLInputElement;

    const width = inputElement.offsetWidth;
    submitButton.style.width = `${width}px`;
  }

  closePopup() {
    this.close.emit();
  }

  onSubmit() {
    if (this.todo.title) {
      this.addTodo.emit(this.todo);
      this.closePopup();
    }
  }
}
