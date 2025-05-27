import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MedicalHistoryService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  // Get medical events for a specific animal
  getMedicalEvents(animalId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/medicalEvents?animalId=${animalId}`).pipe(
      catchError(error => {
        console.error('Error fetching medical events', error);
        return of([]);
      })
    );
  }

  // Add a new medical event
  addMedicalEvent(event: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/medicalEvents`, event);
  }

  // Update a medical event
  updateMedicalEvent(id: number, event: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/medicalEvents/${id}`, event);
  }

  // Delete a medical event
  deleteMedicalEvent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/medicalEvents/${id}`);
  }

  // Get a specific medical event
  getMedicalEvent(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/medicalEvents/${id}`);
  }
}