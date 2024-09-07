import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  showPopup = false;
  todos: any[] = [];

  ngAfterViewInit() {
    // Usa `ngAfterViewInit` per assicurarti che il DOM sia completamente carico
    document.querySelector('.add-todo-btn')?.addEventListener('click', () => {
      this.openPopup();
      console.log('Click');
    });
  }

  openPopup() {
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }

  handleAddTodo(todo: any) {
    this.todos.push(todo);
    console.log('Todo aggiunto:', todo);
  }
}
