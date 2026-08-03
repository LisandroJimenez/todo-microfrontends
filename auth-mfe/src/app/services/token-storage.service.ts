import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  private readonly tokenKey = 'access_token';

  saveToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  removeToken(): void {
    sessionStorage.removeItem(this.tokenKey);
  }
}