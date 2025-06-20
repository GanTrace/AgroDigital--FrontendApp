import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from './auth.service';
import { MockDataService } from '../../shared/services/mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;
  
  constructor(
    private http: HttpClient,
    private mockDataService: MockDataService
  ) {}
  
  getUsersByRole(role: string): Observable<User[]> {
    if (environment.useMockData) {
      return this.mockDataService.getUsersByRole(role);
    }
    
    return this.http.get<User[]>(`${this.apiUrl}?role=${role}`).pipe(
      catchError(error => {
        console.error('Error fetching users by role:', error);
        return of([]);
      })
    );
  }
}