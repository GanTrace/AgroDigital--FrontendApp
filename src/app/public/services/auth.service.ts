import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, map, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { MockDataService } from '../../shared/services/mock-data.service';

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
    private router: Router,
    private mockDataService: MockDataService
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
    
    if (environment.useMockData) {
      return this.mockDataService.addUser(user).pipe(
        tap(response => {
          console.log('Registration successful (mock):', response);
          const { password, ...userWithoutPassword } = response;
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));
          this.currentUser = response;
        }),
        catchError(error => {
          console.error('Registration error (mock):', error);
          throw error;
        })
      );
    }
    
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

  login(credentials: LoginPayload): Observable<User> {
    console.log('Attempting login with:', credentials.email);
    
    if (environment.useMockData) {
      return this.mockDataService.getUserByCredentials(credentials.email, credentials.password).pipe(
        map(users => {
          if (users.length > 0) {
            return users[0];
          } else {
            throw new Error('Invalid credentials');
          }
        }),
        tap(user => {
          console.log('Login response (mock):', user);
          if (user) {
            const { password, ...userWithoutPassword } = user;
            localStorage.setItem('user', JSON.stringify(userWithoutPassword));
            this.currentUser = user;
          }
        }),
        catchError(error => {
          console.error('Error during login (mock):', error);
          return throwError(() => error);
        })
      );
    }
    
    // Buscar usuario por email y password usando json-server
    return this.http.get<User[]>(`${this.apiUrl}?email=${credentials.email}&password=${credentials.password}`).pipe(
      map(users => {
        if (users.length > 0) {
          return users[0];
        } else {
          throw new Error('Invalid credentials');
        }
      }),
      tap(user => {
        console.log('Login response:', user);
        if (user) {
          const { password, ...userWithoutPassword } = user;
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));
          this.currentUser = user;
        }
      }),
      catchError(error => {
        console.error('Error during login:', error);
        return throwError(() => error);
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
    
    if (environment.useMockData) {
      return this.mockDataService.updateUser(user).pipe(
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
    
    if (environment.useMockData) {
      return this.mockDataService.getUserById(id);
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
