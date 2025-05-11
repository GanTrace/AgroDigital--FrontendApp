import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'api/users'; // Replace with your actual API URL

  constructor(private http: HttpClient) { }

  login(credentials: LoginCredentials): Observable<User[]> {
    // For demo purposes, we'll simulate a successful login
    // In a real app, you would call your backend API
    const mockUser: User = {
      id: 1,
      email: credentials.email,
      name: 'Ricardo',
      role: 'rancher'
    };
    
    return of([mockUser]);
  }

  logout(): void {
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }
}