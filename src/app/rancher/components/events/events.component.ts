import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { HeaderComponent } from '../../../public/components/header-component/header-component.component';
import { FooterComponentComponent } from '../../../public/components/footer-component/footer-component.component';
import { LanguageSwitcherComponent } from '../../../public/components/language-switcher/language-switcher.component';
import { AuthService } from '../../../public/services/auth.service';
import { EventService, Event } from '../../services/event.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TranslateModule,
    FooterComponentComponent,
    LanguageSwitcherComponent,
    FormsModule,
    HeaderComponent,
    FooterComponentComponent
  ],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit, OnDestroy {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  displayedEvents: Event[] = [];
  searchTerm: string = '';
  showFilters: boolean = false;
  showEventDetails: boolean = false;
  selectedEvent: Event | null = null;
  showingAllEvents: boolean = false;
  
  eventTypes: string[] = ['Vacunas', 'Visita', 'Feria', 'Capacitación', 'Salud', 'Mercado', 'Tecnología'];
  
  selectedFilters = {
    type: '',
    date: ''
  };
  
  private eventsSubscription: Subscription | null = null;

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
      this.translate.use(savedLang);
    }
    
    this.loadEvents();
  }
  
  ngOnDestroy(): void {
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }
  }

  loadEvents(): void {
    this.eventsSubscription = this.eventService.getEvents().subscribe(
      events => {
        this.events = events;
        this.filteredEvents = [...events];
        this.updateDisplayedEvents();
      },
      error => {
        console.error('Error loading events', error);
      }
    );
  }

  updateDisplayedEvents(): void {
    if (this.showingAllEvents) {
      this.displayedEvents = [...this.filteredEvents];
    } else {
      this.displayedEvents = this.filteredEvents.slice(0, 3);
    }
  }

  toggleViewMore(): void {
    this.showingAllEvents = !this.showingAllEvents;
    this.updateDisplayedEvents();
  }

  search(): void {
    if (!this.searchTerm.trim()) {
      this.filteredEvents = [...this.events];
    } else {
      this.eventService.searchEvents(this.searchTerm).subscribe(
        events => {
          this.filteredEvents = events;
          this.updateDisplayedEvents();
        }
      );
    }
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  applyFilters(): void {
    this.eventService.filterEvents(this.selectedFilters).subscribe(
      events => {
        this.filteredEvents = events;
        this.updateDisplayedEvents();
        this.showFilters = false;
      }
    );
  }

  resetFilters(): void {
    this.selectedFilters = {
      type: '',
      date: ''
    };
    this.filteredEvents = [...this.events];
    this.updateDisplayedEvents();
  }

  canDeleteEvent(event: Event): boolean {
    const currentUser = this.authService.getCurrentUser();
    
    // If no creator ID is set (for demo events), allow deletion
    if (!event.creatorId) {
      return true;
    }
    
    const eventCreatorId = String(event.creatorId);
    const currentUserId = currentUser?.id ? String(currentUser.id) : '';
    
    // Compare as strings
    return eventCreatorId === currentUserId;
  }

  deleteEvent(eventItem: Event, e: MouseEvent): void {
    e.stopPropagation(); // Now this will work correctly
    
    if (!this.canDeleteEvent(eventItem)) {
      alert(this.translate.instant('EVENTS.CANNOT_DELETE'));
      return;
    }
    
    if (confirm(this.translate.instant('EVENTS.CONFIRM_DELETE'))) {
      if (eventItem.id) {
        this.eventService.deleteEvent(eventItem.id).subscribe(
          () => {
            this.events = this.events.filter(e => e.id !== eventItem.id);
            this.filteredEvents = this.filteredEvents.filter(e => e.id !== eventItem.id);
            this.updateDisplayedEvents();
          },
          error => {
            console.error('Error deleting event', error);
          }
        );
      }
    }
  }

  viewEventDetails(event: Event): void {
    this.selectedEvent = event;
    this.showEventDetails = true;
  }

  closeEventDetails(): void {
    this.showEventDetails = false;
    this.selectedEvent = null;
  }
}
