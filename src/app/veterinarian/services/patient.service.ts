import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, catchError, tap, map } from 'rxjs';
import { AuthService } from '../../public/services/auth.service';

export interface Patient {
  id?: number;
  name: string;
  type: string;
  age: string;
  gender: string;
  healthIssues: string;
  owner: string;
  lastVisit: string;
  nextVisit: string;
  image: string;
  observations?: string;
  createdBy?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = 'http://localhost:3000/patients';
  
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}
  
  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.apiUrl).pipe(
      catchError(this.handleError<Patient[]>('getPatients', []))
    );
  }
  
  getPatientsByUser(): Observable<Patient[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      return of([]);
    }
    
    return this.http.get<Patient[]>(`${this.apiUrl}?createdBy=${currentUser.id}`).pipe(
      catchError(error => {
        console.error('Error fetching patients by user:', error);
        return of([]);
      })
    );
  }
  
  getPatientById(id: number): Observable<Patient | undefined> {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching patient with id ${id}:`, error);
        return of(undefined);
      })
    );
  }
  
  addPatient(patient: Patient): Observable<Patient> {
    // Asegurarse de que el usuario actual sea el creador
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.id) {
      patient.createdBy = currentUser.id;
    }
    
    return this.http.post<Patient>(this.apiUrl, patient).pipe(
      catchError(error => {
        console.error('Error adding patient:', error);
        return of(patient);
      })
    );
  }
  
  updatePatient(patient: Patient): Observable<Patient> {
    return this.http.put<Patient>(`${this.apiUrl}/${patient.id}`, patient).pipe(
      catchError(error => {
        console.error(`Error updating patient with id ${patient.id}:`, error);
        return of(patient);
      })
    );
  }
  
  deletePatient(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error deleting patient with id ${id}:`, error);
        return of({ success: true });
      })
    );
  }
  
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}