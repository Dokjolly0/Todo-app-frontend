import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap, tap } from 'rxjs';
import { Todo } from '../entity/todo.entity';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private sharedData: any;
  constructor(private http: HttpClient) {}

  getTodo(token: string, completed: boolean): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let url = 'http://localhost:3000/api/todos';
    if (completed) url += '?showCompleted=true';

    return this.http.get(url, { headers });
  }

  addTodo(token: string, todo: Todo) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const newTodo = {
      ...todo,
      assignedTo: todo.assignedTo ? todo.assignedTo.id : undefined, // Solo l'ID
    };

    return this.http.post('http://localhost:3000/api/todos', newTodo, {
      headers,
    });
  }

  setSharedData(data: any) {
    this.sharedData = data;
  }

  getSharedData() {
    return this.sharedData;
  }

  getUserFullName(): string {
    const user = this.getUser();
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  private getUser() {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }

  findUserByFullName(token: string, fullName: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = 'http://localhost:3000/api/users/user/:fullName'; // URL con :fullName come placeholder
    const params = { fullName: fullName };

    return this.http.get(url, { headers, params });
  }

  checkTodo(token: string, id: string, completed: boolean) {
    let completed_param = '';
    if (completed === true) completed_param = 'check';
    else completed_param = 'uncheck';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `http://localhost:3000/api/todos/${id}/${completed_param}`;

    return this.http.patch(url, {}, { headers });
  }

  getTodoByTitle(token: string, title: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `http://localhost:3000/api/todos/title/${title}`;

    return this.http.get<Todo[]>(url, { headers });
  }

  getById(token: string, id: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `http://localhost:3000/api/todos/id/${id}`;

    return this.http.get(url, { headers });
  }

  updateTodo(token: string, todo: Todo) {
    const url = 'http://localhost:3000/api/todos/update';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = {
      ...todo,
      createdBy: todo.createdBy!.id, // Solo l'ID
      assignedTo: todo.assignedTo ? todo.assignedTo.id : undefined, // Solo l'ID
    };

    return this.http.patch(url, body, { headers });
  }

  assignTodo(id: string, assignedTo: string, token: string) {
    const url = `http://localhost:3000/api/todos/${id}/assign`;
    const body = { assignedTo };
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(url, body, { headers });
  }

  delate(id: string, token: string) {
    const url = `http://localhost:3000/api/todos/delete/${id}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.delete(url, { headers });
  }
}
