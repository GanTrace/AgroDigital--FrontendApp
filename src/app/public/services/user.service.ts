import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { User } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';
  
  constructor(private http: HttpClient) {}
  
  getUsersByRole(role: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}?role=${role}`).pipe(
      catchError(error => {
        console.error('Error fetching users by role:', error);
        return of([]);
      })
    );
  }
}