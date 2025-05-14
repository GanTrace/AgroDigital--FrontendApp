import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface Event {
  id?: number;
  tipo: string;
  titulo: string;
  fecha: string;
  descripcion: string;
  imagen: string;
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
      imagen: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=1000&auto=format&fit=crop'
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
    // Cargar eventos del localStorage si existen
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
    // Generar un ID único para el nuevo evento
    const newId = this.events.length > 0 ? Math.max(...this.events.map(e => e.id || 0)) + 1 : 1;
    
    const newEvent: Event = {
      ...event,
      id: newId
    };
    
    this.events.push(newEvent);
    
    // Guardar en localStorage
    localStorage.setItem('events', JSON.stringify(this.events));
    
    // Notificar a los suscriptores
    this.eventsSubject.next(this.events);
    
    return of(newEvent);
  }

  updateEvent(event: Event): Observable<Event> {
    const index = this.events.findIndex(e => e.id === event.id);
    
    if (index !== -1) {
      this.events[index] = event;
      
      // Guardar en localStorage
      localStorage.setItem('events', JSON.stringify(this.events));
      
      // Notificar a los suscriptores
      this.eventsSubject.next(this.events);
      
      return of(event);
    }
    
    return of({} as Event);
  }

  deleteEvent(id: number): Observable<boolean> {
    const index = this.events.findIndex(e => e.id === id);
    
    if (index !== -1) {
      this.events.splice(index, 1);
      
      // Guardar en localStorage
      localStorage.setItem('events', JSON.stringify(this.events));
      
      // Notificar a los suscriptores
      this.eventsSubject.next(this.events);
      
      return of(true);
    }
    
    return of(false);
  }
}