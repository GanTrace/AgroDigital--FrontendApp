import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  role?: string;
  profileImage?: string | null; 
}

export interface LoginPayload {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/users`;
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
    
    console.log('Registering user with role:', user.role);
    
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

  updateUser(user: any): Observable<any> {
    if (user.id === undefined) {
      console.error('updateUser called with undefined ID');
      return of({}); 
    }
    
    return this.http.put<any>(`${this.apiUrl}/${user.id}`, user).pipe(
      tap(updatedUser => {
        
        if (this.isLoggedIn()) {
          const currentUser = this.getCurrentUser();
          if (currentUser && currentUser.id === updatedUser.id) {
            
            localStorage.setItem('user', JSON.stringify(updatedUser));
            this.currentUser = updatedUser;
          }
        }
      })
    );
  }
  
  getUserById(id: number): Observable<User> {
    if (id === undefined) {
      console.error('getUserById called with undefined ID');
      return of({} as User);
    }
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  getDashboardRoute(): string {
    const user = this.getCurrentUser();
    if (user && user.role === 'veterinarian') {
      return '/veterinarian/dashboard';
    }
    return '/dashboard'; 
  }
}
