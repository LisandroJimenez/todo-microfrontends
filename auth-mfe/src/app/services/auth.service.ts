import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { LoginRequest } from '../models/login-request';
import { LoginResponse } from '../models/login-response';
import { RegisterRequest } from '../models/register-request';
import { RegisterResponse } from '../models/register-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8080';

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/auth/login`,
      credentials
    );
  }

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${this.apiUrl}/auth/registro`,
      data
    );
  }
}