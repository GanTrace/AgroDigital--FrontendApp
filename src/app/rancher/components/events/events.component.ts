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
  currentUserId: string = '';

  constructor(
    private eventService: EventService,
    private translate: TranslateService,
    private authService: AuthService // Add AuthService
  ) {}

  // Get current user ID
  ngOnInit(): void {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
      this.translate.use(savedLang);
    }
    
    // Get current user ID - fix type issue
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.id) {
      // Ensure currentUserId is always a string
      this.currentUserId = String(currentUser.id);
    }
    
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe(events => {
      this.allEvents = events;
      this.filteredEvents = [...this.allEvents];
      
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
      if (this.selectedFilters.type !== 'Todos' && event.tipo !== this.selectedFilters.type) {
        return false;
      }
      
      if (this.selectedFilters.date && event.fecha !== this.selectedFilters.date) {
        return false;
      }
      
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

  // Add these new methods
  canDeleteEvent(event: Event): boolean {
    // For demo purposes, let's assume the user can delete all events
    // In a real app, you would check if the current user is the creator
    return true;
  }

  deleteEvent(eventItem: Event, e: MouseEvent): void {
    e.stopPropagation(); // Now this will work correctly
    
    if (!this.canDeleteEvent(eventItem)) {
      alert(this.translate.instant('EVENTS.CANNOT_DELETE'));
      return;
    }
    
    if (confirm(this.translate.instant('EVENTS.CONFIRM_DELETE'))) {
      const eventId = eventItem.id !== undefined ? eventItem.id : 0;
      
      this.eventService.deleteEvent(eventId).subscribe(
        success => {
          if (success) {
            this.loadEvents(); 
          } else {
            alert(this.translate.instant('EVENTS.DELETE_ERROR'));
          }
        }
      );
    }
  }
}
