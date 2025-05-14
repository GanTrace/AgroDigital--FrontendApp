import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FooterComponentComponent } from '../../../public/components/footer-component/footer-component.component';
import { LanguageSwitcherComponent } from '../../../public/components/language-switcher/language-switcher.component';
import { AuthService } from '../../../public/services/auth.service';
import { NotificationsComponent } from '../../../public/pages/notifications/notifications.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../public/components/header-component/header-component.component';
import { EventService, Event } from '../../services/event.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    TranslateModule,
    FooterComponentComponent,
    LanguageSwitcherComponent,
    NotificationsComponent,
    FormsModule,
    HeaderComponent,
    FooterComponentComponent
  ],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  events: Event[] = [];
  allEvents: Event[] = [];
  filteredEvents: Event[] = [];
  showFilters: boolean = false;
  showingAllEvents: boolean = false;
  eventTypes: string[] = ['Todos', 'Vacunas', 'Visita', 'Feria', 'Capacitación', 'Salud', 'Mercado', 'Tecnología'];
  selectedFilters = {
    type: 'Todos',
    date: ''
  };
  searchTerm: string = '';

  constructor(
    private translate: TranslateService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
      this.translate.use(savedLang);
    }
    
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe(events => {
      this.allEvents = events;
      this.filteredEvents = [...this.allEvents];
      
      // Mostrar solo los primeros 3 eventos inicialmente
      if (!this.showingAllEvents) {
        this.events = this.filteredEvents.slice(0, 3);
      } else {
        this.events = this.filteredEvents;
      }
    });
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  toggleViewMore(): void {
    this.showingAllEvents = !this.showingAllEvents;
    
    if (this.showingAllEvents) {
      this.events = this.filteredEvents;
    } else {
      this.events = this.filteredEvents.slice(0, 3);
    }
  }

  applyFilters(): void {
    this.filteredEvents = this.allEvents.filter(event => {
      // Filtrar por tipo
      if (this.selectedFilters.type !== 'Todos' && event.tipo !== this.selectedFilters.type) {
        return false;
      }
      
      // Filtrar por fecha
      if (this.selectedFilters.date && event.fecha !== this.selectedFilters.date) {
        return false;
      }
      
      // Filtrar por término de búsqueda
      if (this.searchTerm && !this.matchesSearchTerm(event)) {
        return false;
      }
      
      return true;
    });
    
    if (this.showingAllEvents) {
      this.events = this.filteredEvents;
    } else {
      this.events = this.filteredEvents.slice(0, 3);
    }
    
    this.showFilters = false;
  }

  matchesSearchTerm(event: Event): boolean {
    const term = this.searchTerm.toLowerCase();
    return (
      event.titulo.toLowerCase().includes(term) ||
      event.descripcion.toLowerCase().includes(term) ||
      event.tipo.toLowerCase().includes(term)
    );
  }

  resetFilters(): void {
    this.selectedFilters = {
      type: 'Todos',
      date: ''
    };
    this.searchTerm = '';
    this.filteredEvents = [...this.allEvents];
    
    if (this.showingAllEvents) {
      this.events = this.filteredEvents;
    } else {
      this.events = this.filteredEvents.slice(0, 3);
    }
  }

  search(): void {
    this.applyFilters();
  }
}
