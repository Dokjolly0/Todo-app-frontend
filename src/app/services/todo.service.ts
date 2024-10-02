import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo } from '../entity/todo.entity';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private sharedData: any;
  private url: string = 'http://159.223.142.172:3000/api'; // URL del server

  constructor(private http: HttpClient) {}

  getTodo(token: string, completed: boolean): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let url = `${this.url}/todos`; // Utilizza l'URL definito
    if (completed) url += '?showCompleted=true';

    return this.http.get(url, { headers });
  }

  addTodo(token: string, todo: Todo) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const newTodo = {
      ...todo,
      assignedTo: todo.assignedTo ? todo.assignedTo.id : undefined, // Solo l'ID
    };

    return this.http.post(`${this.url}/todos`, newTodo, { headers });
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
    const url = `${this.url}/users/user/${fullName}`; // Usa l'URL definito

    return this.http.get(url, { headers });
  }

  checkTodo(token: string, id: string, completed: boolean) {
    let completed_param = completed ? 'check' : 'uncheck';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.url}/todos/${id}/${completed_param}`;

    return this.http.patch(url, {}, { headers });
  }

  getTodoByTitle(token: string, title: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.url}/todos/title/${title}`;

    return this.http.get<Todo[]>(url, { headers });
  }

  getById(token: string, id: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.url}/todos/id/${id}`;

    return this.http.get(url, { headers });
  }

  updateTodo(token: string, todo: Todo) {
    const url = `${this.url}/todos/update`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = {
      ...todo,
      createdBy: todo.createdBy!.id, // Solo l'ID
      assignedTo: todo.assignedTo ? todo.assignedTo.id : undefined, // Solo l'ID
    };

    return this.http.patch(url, body, { headers });
  }

  assignTodo(id: string, assignedTo: string, token: string) {
    const url = `${this.url}/todos/${id}/assign`;
    const body = { assignedTo };
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(url, body, { headers });
  }

  delate(id: string, token: string) {
    const url = `${this.url}/todos/delete/${id}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.delete(url, { headers });
  }
}
