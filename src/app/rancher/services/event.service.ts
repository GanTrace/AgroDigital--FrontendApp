import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Event {
  id?: number;
  tipo: string;
  titulo: string;
  fecha: string;
  descripcion: string;
  imagen: string;
  creatorId?: number | string;
  creatorName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:3000/events';

  constructor(private http: HttpClient) { }

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching events', error);
        return of([]);
      })
    );
  }

  getEventById(id: number): Observable<Event | null> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching event with id ${id}`, error);
        return of(null);
      })
    );
  }

  addEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, event).pipe(
      catchError(error => {
        console.error('Error adding event', error);
        throw error;
      })
    );
  }

  updateEvent(event: Event): Observable<Event> {
    if (!event.id) {
      console.error('Cannot update event without id');
      return of(event);
    }
    
    return this.http.put<Event>(`${this.apiUrl}/${event.id}`, event).pipe(
      catchError(error => {
        console.error(`Error updating event with id ${event.id}`, error);
        throw error;
      })
    );
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error deleting event with id ${id}`, error);
        throw error;
      })
    );
  }

  searchEvents(term: string): Observable<Event[]> {
    if (!term.trim()) {
      return this.getEvents();
    }
    
    return this.getEvents().pipe(
      map(events => events.filter(event => 
        event.titulo.toLowerCase().includes(term.toLowerCase()) ||
        event.descripcion.toLowerCase().includes(term.toLowerCase()) ||
        event.tipo.toLowerCase().includes(term.toLowerCase())
      ))
    );
  }

  filterEvents(filters: any): Observable<Event[]> {
    return this.getEvents().pipe(
      map(events => {
        return events.filter(event => {
          let match = true;
          
          if (filters.type && filters.type !== 'all' && event.tipo !== filters.type) {
            match = false;
          }
          
          if (filters.date && new Date(event.fecha).toISOString().split('T')[0] !== filters.date) {
            match = false;
          }
          
          return match;
        });
      })
    );
  }
}