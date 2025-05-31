import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { AuthService } from '../../public/services/auth.service';

export interface Treatment {
  id?: number;
  name: string;
  category: string;
  description: string;
  price: number;
  duration: string;
  materials: string[];
  steps: string[];
  animalTypes: string[];
  image: string;
  createdBy?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TreatmentService {
  private apiUrl = 'http://localhost:3000/treatments';
  
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}
  
  getTreatments(): Observable<Treatment[]> {
    return this.http.get<Treatment[]>(this.apiUrl).pipe(
      catchError(this.handleError<Treatment[]>('getTreatments', []))
    );
  }
  
  getTreatmentsByUser(): Observable<Treatment[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      return of([]);
    }
    
    return this.http.get<Treatment[]>(`${this.apiUrl}?createdBy=${currentUser.id}`).pipe(
      catchError(error => {
        console.error('Error fetching treatments by user:', error);
        return of([]);
      })
    );
  }
  
  getTreatmentById(id: number): Observable<Treatment | undefined> {
    return this.http.get<Treatment>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching treatment with id ${id}:`, error);
        return of(undefined);
      })
    );
  }
  
  addTreatment(treatment: Treatment): Observable<Treatment> {
    // Asegurarse de que el usuario actual sea el creador
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.id) {
      treatment.createdBy = currentUser.id;
    }
    
    return this.http.post<Treatment>(this.apiUrl, treatment).pipe(
      catchError(error => {
        console.error('Error adding treatment:', error);
        return of(treatment);
      })
    );
  }
  
  updateTreatment(treatment: Treatment): Observable<Treatment> {
    return this.http.put<Treatment>(`${this.apiUrl}/${treatment.id}`, treatment).pipe(
      catchError(error => {
        console.error(`Error updating treatment with id ${treatment.id}:`, error);
        return of(treatment);
      })
    );
  }
  
  deleteTreatment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error deleting treatment with id ${id}:`, error);
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