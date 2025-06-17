import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { AuthService } from '../../public/services/auth.service';
import { environment } from '../../../environments/environment';

export interface Appointment {
  id?: number;
  patientId: number;
  patientName: string;
  ownerName: string;
  date: string;
  time: string;
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string;
  createdBy?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = `${environment.apiUrl}/appointments`;
  
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}
  
  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl).pipe(
      catchError(this.handleError<Appointment[]>('getAppointments', []))
    );
  }
  
  getAppointmentsByUser(): Observable<Appointment[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      return of([]);
    }
    
    return this.http.get<Appointment[]>(`${this.apiUrl}?createdBy=${currentUser.id}`).pipe(
      catchError(error => {
        console.error('Error fetching appointments by user:', error);
        return of([]);
      })
    );
  }
  
  getAppointmentById(id: number): Observable<Appointment | undefined> {
    return this.http.get<Appointment>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching appointment with id ${id}:`, error);
        return of(undefined);
      })
    );
  }
  
  addAppointment(appointment: Appointment): Observable<Appointment> {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.id) {
      appointment.createdBy = currentUser.id;
    }
    
    return this.http.post<Appointment>(this.apiUrl, appointment).pipe(
      catchError(error => {
        console.error('Error adding appointment:', error);
        return of(appointment);
      })
    );
  }
  
  updateAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/${appointment.id}`, appointment).pipe(
      catchError(error => {
        console.error(`Error updating appointment with id ${appointment.id}:`, error);
        return of(appointment);
      })
    );
  }
  
  deleteAppointment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error deleting appointment with id ${id}:`, error);
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