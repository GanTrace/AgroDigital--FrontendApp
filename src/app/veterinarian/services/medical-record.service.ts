import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../public/services/auth.service';

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
  private apiUrl = 'http://localhost:3000/medicalRecords';
  
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
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.id) {
      record.createdBy = currentUser.id;
    }
    record.createdAt = new Date().toISOString();
    
    return this.http.post<MedicalRecord>(this.apiUrl, record).pipe(
      catchError(error => {
        console.error('Error adding medical record:', error);
        return of(record);
      })
    );
  }
  
  updateMedicalRecord(record: MedicalRecord): Observable<MedicalRecord> {
    return this.http.put<MedicalRecord>(`${this.apiUrl}/${record.id}`, record).pipe(
      catchError(error => {
        console.error(`Error updating medical record with id ${record.id}:`, error);
        return of(record);
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