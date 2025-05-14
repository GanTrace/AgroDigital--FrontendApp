import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FooterComponentComponent } from '../../../public/components/footer-component/footer-component.component';
import { LanguageSwitcherComponent } from '../../../public/components/language-switcher/language-switcher.component';
import { AuthService } from '../../../public/services/auth.service';
import { NotificationsComponent } from '../../../public/pages/notifications/notifications.component';
import { FormsModule } from '@angular/forms';

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
    FormsModule
  ],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  userName: string = '';
  animalCount: string = '0 animales';
  showNotifications: boolean = false;
  showFilters: boolean = false;
  
  showingAllEvents: boolean = false;
  
  eventTypes = ['Todos', 'Vacunas', 'Visita', 'Feria', 'Capacitación', 'Salud', 'Mercado', 'Tecnología'];
  
  selectedFilters = {
    type: 'Todos',
    date: ''
  };
  

  allEvents = [
    {
      tipo: 'Vacunas',
      titulo: 'Vacunación Municipal',
      fecha: '23 de abril del 2024',
      descripcion: 'Lorem ipsum vitae ullamcorper gravida aliquam laoreet elementum donec vestibulum dictumst tortor',
      imagen: '/assets/img/vacunacion1.jpg'
    },
    {
      tipo: 'Visita',
      titulo: 'Visita Municipal',
      fecha: '21 de junio del 2024',
      descripcion: 'Lorem ipsum vitae ullamcorper gravida aliquam laoreet elementum donec vestibulum dictumst tortor',
      imagen: '/assets/img/visita1.jpg'
    },
    {
      tipo: 'Visita',
      titulo: 'Micro Exportadores',
      fecha: '12 de agosto del 2024',
      descripcion: 'Lorem ipsum vitae ullamcorper gravida aliquam laoreet elementum donec vestibulum dictumst tortor',
      imagen: '/assets/img/visita2.jpg'
    },
    {
      tipo: 'Feria',
      titulo: 'Feria Ganadera Regional',
      fecha: '15 de mayo del 2024',
      descripcion: 'Exposición de ganado de alta calidad con oportunidades de compra y venta. Incluye concursos y premios para los mejores ejemplares.',
      imagen: '/assets/img/feria1.jpg'
    },
    {
      tipo: 'Capacitación',
      titulo: 'Taller de Nutrición Animal',
      fecha: '10 de junio del 2024',
      descripcion: 'Aprenda sobre las últimas técnicas en nutrición animal para mejorar la salud y productividad de su ganado con expertos del sector.',
      imagen: '/assets/img/capacitacion1.jpg'
    },
    {
      tipo: 'Salud',
      titulo: 'Campaña de Desparasitación',
      fecha: '5 de julio del 2024',
      descripcion: 'Campaña gratuita de desparasitación para todo tipo de ganado. Incluye revisión general y recomendaciones personalizadas.',
      imagen: '/assets/img/salud1.jpg'
    },
    {
      tipo: 'Mercado',
      titulo: 'Subasta Ganadera',
      fecha: '20 de julio del 2024',
      descripcion: 'Gran subasta de ganado bovino, ovino y porcino. Oportunidad única para adquirir ejemplares de alta calidad a precios competitivos.',
      imagen: '/assets/img/subasta1.jpg'
    },
    {
      tipo: 'Tecnología',
      titulo: 'Expo Agrotecnología',
      fecha: '8 de agosto del 2024',
      descripcion: 'Exhibición de las últimas innovaciones tecnológicas para el sector ganadero. Demostraciones prácticas y asesoramiento especializado.',
      imagen: '/assets/img/tecnologia1.jpg'
    },
    {
      tipo: 'Capacitación',
      titulo: 'Curso de Inseminación Artificial',
      fecha: '15 de septiembre del 2024',
      descripcion: 'Curso práctico sobre técnicas modernas de inseminación artificial para mejorar la genética de su ganado. Certificación incluida.',
      imagen: '/assets/img/capacitacion2.jpg'
    }
  ];
  
  filteredEvents = [...this.allEvents];
  
  events = this.filteredEvents.slice(0, 3);

  constructor(
    private translate: TranslateService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
      this.translate.use(savedLang);
    }
    
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.name;
    }
    
    this.filteredEvents = [...this.allEvents];
    this.events = this.filteredEvents.slice(0, 3);
  }
  
  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }
  
  logout(): void {
    this.authService.logout();
  }
  
  toggleViewMore(): void {
    if (this.showingAllEvents) {
      this.events = this.filteredEvents.slice(0, 3);
      this.showingAllEvents = false;
    } else {
      this.events = this.filteredEvents;
      this.showingAllEvents = true;
    }
  }
  
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }
  
  applyFilters(): void {
    this.filteredEvents = this.allEvents.filter(event => {
      if (this.selectedFilters.type !== 'Todos' && event.tipo !== this.selectedFilters.type) {
        return false;
      }
      
      if (this.selectedFilters.date && event.fecha !== this.selectedFilters.date) {
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
  
  resetFilters(): void {
    this.selectedFilters = {
      type: 'Todos',
      date: ''
    };
    
    this.filteredEvents = [...this.allEvents];
    
    if (this.showingAllEvents) {
      this.events = this.filteredEvents;
    } else {
      this.events = this.filteredEvents.slice(0, 3);
    }
  }
}
