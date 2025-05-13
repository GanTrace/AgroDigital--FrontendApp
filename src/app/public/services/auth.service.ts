import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users'; //Fake Api
  private currentUser: User | null = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  register(payload: RegisterPayload): Observable<User> {
  
    const userWithRole = { ...payload, role: 'rancher' };
    
    return this.http.post<User>(this.apiUrl, userWithRole).pipe(
      tap(user => {
       
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
      })
    );
  }

  login(payload: LoginPayload): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${payload.email}&password=${payload.password}`).pipe(
      tap(users => {
        if (users.length > 0) {
          
          this.currentUser = users[0];
          localStorage.setItem('currentUser', JSON.stringify(users[0]));
        }
      })
    );
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    if (!this.currentUser) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      }
    }
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }
}
