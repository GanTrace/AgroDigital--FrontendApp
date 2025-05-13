import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';
  private currentUser: User | null = null;
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

  register(userData: any): Observable<User> {
    const user = {
      ...userData,
      role: userData.role || 'rancher'
    };
    
    return this.http.post<User>(this.apiUrl, user).pipe(
      tap(response => {
        console.log('Registration successful:', response);
        const { password, ...userWithoutPassword } = response;
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        this.currentUser = response;
      }),
      catchError(error => {
        console.error('Registration error:', error);
        throw error;
      })
    );
  }

  login(credentials: LoginPayload): Observable<User[]> {
    console.log('Attempting login with:', credentials.email);
    return this.http.get<User[]>(`${this.apiUrl}?email=${credentials.email}&password=${credentials.password}`).pipe(
      tap(users => {
        console.log('Login response:', users);
        if (users.length > 0) {
          const { password, ...userWithoutPassword } = users[0];
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));
          this.currentUser = users[0];
        }
      }),
      catchError(error => {
        console.error('Error during login:', error);
        return of([]);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('user');
    this.currentUser = null;
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('user') !== null;
  }

  getCurrentUser(): User | null {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      return JSON.parse(userJson);
    }
    return null;
  }
}
