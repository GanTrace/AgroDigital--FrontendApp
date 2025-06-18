import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../public/services/auth.service';
import { environment } from '../../../environments/environment';

export interface MedicalRecord {
  id?: number;
  patientId: number;
  patientName: string;
  ownerName: string;
  date: string;
  recordType: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  followUp: string;
  attachments?: string[];
  createdBy?: number;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MedicalRecordService {
  private apiUrl = `${environment.apiUrl}/medical-records`;
  
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}
  
  getMedicalRecords(): Observable<MedicalRecord[]> {
    return this.http.get<MedicalRecord[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching medical records:', error);
        return of([]);
      })
    );
  }
  
  getMedicalRecordsByUser(): Observable<MedicalRecord[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      return of([]);
    }
    
    return this.http.get<MedicalRecord[]>(`${this.apiUrl}?createdBy=${currentUser.id}`).pipe(
      catchError(error => {
        console.error('Error fetching medical records by user:', error);
        return of([]);
      })
    );
  }
  
  getMedicalRecord(id: number): Observable<MedicalRecord> {
    return this.http.get<MedicalRecord>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching medical record with id ${id}:`, error);
        return of({} as MedicalRecord);
      })
    );
  }
  
  addMedicalRecord(record: MedicalRecord): Observable<MedicalRecord> {
    // Configurar headers correctos
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    // Asegurar que createdBy esté incluido
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.id) {
      record.createdBy = currentUser.id;
    }
    
    // Validar datos requeridos antes de enviar
    if (!record.patientId || !record.patientName || !record.ownerName || 
        !record.date || !record.recordType || !record.diagnosis || !record.treatment) {
      console.error('Missing required fields in medical record:', record);
      return throwError(() => new Error('Faltan campos requeridos'));
    }
    
    console.log('Sending POST request to:', this.apiUrl);
    console.log('With headers:', headers);
    console.log('With data:', record);
    
    return this.http.post<MedicalRecord>(this.apiUrl, record, { headers }).pipe(
      catchError(error => {
        console.error('Error adding medical record:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        console.error('Error response:', error.error);
        return throwError(() => error);
      })
    );
  }
  
  updateMedicalRecord(record: MedicalRecord): Observable<MedicalRecord> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.put<MedicalRecord>(`${this.apiUrl}/${record.id}`, record, { headers }).pipe(
      catchError(error => {
        console.error(`Error updating medical record with id ${record.id}:`, error);
        return throwError(() => error);
      })
    );
  }
  
  deleteMedicalRecord(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error deleting medical record with id ${id}:`, error);
        return of(null);
      })
    );
  }
}