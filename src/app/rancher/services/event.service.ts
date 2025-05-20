import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface Event {
  id?: number;
  tipo: string;
  titulo: string;
  fecha: string;
  descripcion: string;
  imagen: string;
  creatorId?: string;
  creatorName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private events: Event[] = [
    {
      id: 1,
      tipo: 'Vacunas',
      titulo: 'Campaña de vacunación',
      fecha: '2023-12-15',
      descripcion: 'Campaña de vacunación contra la fiebre aftosa para todo el ganado.',
      imagen: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=1000&auto=format&fit=crop',
      creatorId: 'admin' // Default creator for initial events
    },
    {
      id: 2,
      tipo: 'Feria',
      titulo: 'Feria ganadera regional',
      fecha: '2024-01-20',
      descripcion: 'Exposición de ganado y productos agrícolas con oportunidades de negocio.',
      imagen: 'https://images.unsplash.com/photo-1605280263929-1c42c62ef169?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: 3,
      tipo: 'Capacitación',
      titulo: 'Taller de manejo sostenible',
      fecha: '2024-02-05',
      descripcion: 'Aprende técnicas de manejo sostenible para mejorar la productividad de tu ganado.',
      imagen: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=1000&auto=format&fit=crop'
    }
  ];

  private eventsSubject = new BehaviorSubject<Event[]>(this.events);

  constructor() {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      this.events = JSON.parse(storedEvents);
      this.eventsSubject.next(this.events);
    }
  }

  getEvents(): Observable<Event[]> {
    return this.eventsSubject.asObservable();
  }

  addEvent(event: Event): Observable<Event> {
    const newId = this.events.length > 0 ? Math.max(...this.events.map(e => e.id || 0)) + 1 : 1;
    
    const newEvent: Event = {
      ...event,
      id: newId
    };
    
    this.events.push(newEvent);
    
    localStorage.setItem('events', JSON.stringify(this.events));
    this.eventsSubject.next(this.events);
    
    return of(newEvent);
  }

  // Add method to check if user can delete an event
  canDeleteEvent(eventId: number, userId: string): boolean {
    const event = this.events.find(e => e.id === eventId);
    return event?.creatorId === userId;
  }

  updateEvent(event: Event): Observable<Event> {
    const index = this.events.findIndex(e => e.id === event.id);
    
    if (index !== -1) {
      this.events[index] = event;
      
      localStorage.setItem('events', JSON.stringify(this.events));
      
      this.eventsSubject.next(this.events);
      
      return of(event);
    }
    
    return of({} as Event);
  }

  deleteEvent(id: number): Observable<boolean> {
    const index = this.events.findIndex(e => e.id === id);
    
    if (index !== -1) {
      this.events.splice(index, 1);
      
      localStorage.setItem('events', JSON.stringify(this.events));
      
      this.eventsSubject.next(this.events);
      
      return of(true);
    }
    
    return of(false);
  }
}