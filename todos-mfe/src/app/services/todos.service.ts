import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Todo } from '../models/todo';
import { CreateTodoRequest } from '../models/create-todo-request';
import { UpdateTodoRequest } from '../models/update-todo-request';

@Injectable({
  providedIn: 'root'
})
export class TodosService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8080/todos';

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl);
  }

  getTodoById(id: string): Observable<Todo> {
    return this.http.get<Todo>(`${this.apiUrl}/${id}`);
  }

  createTodo(data: CreateTodoRequest): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, data);
  }

  updateTodo(id: string, data: UpdateTodoRequest): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/${id}`, data);
  }

  deleteTodo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}