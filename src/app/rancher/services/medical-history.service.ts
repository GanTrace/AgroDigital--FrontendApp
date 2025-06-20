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
    return this.http.get<any[]>(`${this.apiUrl}/medicalRecords?patientId=${animalId}`).pipe(
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
      createdBy: currentUser?.id,
      createdAt: new Date().toISOString()
    };
    
    return this.http.post(`${this.apiUrl}/medicalRecords`, eventWithUser);
  }

  updateMedicalEvent(id: number, event: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/medicalRecords/${id}`, event);
  }

  deleteMedicalEvent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/medicalRecords/${id}`);
  }

  getMedicalEvent(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/medicalRecords/${id}`);
  }
}