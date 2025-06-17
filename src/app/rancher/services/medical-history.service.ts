import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../../public/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MedicalHistoryService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getMedicalEvents(animalId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/medicalEvents?animalId=${animalId}`).pipe(
      catchError(error => {
        console.error('Error fetching medical events', error);
        return of([]);
      })
    );
  }

  addMedicalEvent(event: any): Observable<any> {
    const currentUser = this.authService.getCurrentUser();
    
    const eventWithUser = {
      ...event,
      userId: currentUser?.id,
      userName: currentUser?.name,
      createdAt: new Date().toISOString()
    };
    
    return this.http.post(`${this.apiUrl}/medicalEvents`, eventWithUser);
  }

  updateMedicalEvent(id: number, event: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/medicalEvents/${id}`, event);
  }

  deleteMedicalEvent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/medicalEvents/${id}`);
  }

  getMedicalEvent(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/medicalEvents/${id}`);
  }
}