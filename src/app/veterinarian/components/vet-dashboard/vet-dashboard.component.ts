import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../public/services/auth.service';
import { FooterComponentComponent } from '../../../public/components/footer-component/footer-component.component';
import { LanguageSwitcherComponent } from '../../../public/components/language-switcher/language-switcher.component';
import { NotificationsComponent } from '../../../public/pages/notifications/notifications.component';
import { HeaderComponent } from '../../../public/components/header-component/header-component.component';

interface Patient {
  id: number;
  nombre: string;
  tipo: string;
  edad: string;
  sexo: string;
  problemasSalud: string;
  propietario: string;
  ultimaVisita: string;
  proximaVisita: string;
  imagen: string;
}

@Component({
  selector: 'app-vet-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TranslateModule,
    FooterComponentComponent,
    LanguageSwitcherComponent,
    NotificationsComponent,
    HeaderComponent
  ],
  templateUrl: './vet-dashboard.component.html',
  styleUrl: './vet-dashboard.component.css'
})
export class VetDashboardComponent implements OnInit {
  userName = '';
  patientCount = '0 pacientes';
  showNotifications = false;
  searchTerm = '';
  showFilters = false;
  
  patients: Patient[] = [
    {
      id: 1,
      nombre: 'Clery',
      tipo: 'Vaca Holstein',
      edad: '4 años',
      sexo: 'Hembra',
      problemasSalud: 'Ninguno',
      propietario: 'Rodrigo',
      ultimaVisita: '15/10/2023',
      proximaVisita: '15/01/2024',
      imagen: 'assets/images/animals/vaca1.jpg'
    },
    {
      id: 2,
      nombre: 'Bella',
      tipo: 'Cabra Alpina',
      edad: '2 años',
      sexo: 'Hembra',
      problemasSalud: 'Cojera leve',
      propietario: 'Gary',
      ultimaVisita: '20/11/2023',
      proximaVisita: '20/12/2023',
      imagen: 'assets/images/animals/cabra1.jpg'
    },
    {
      id: 3,
      nombre: 'Max',
      tipo: 'Toro Angus',
      edad: '5 años',
      sexo: 'Macho',
      problemasSalud: 'Ninguno',
      propietario: 'Nelson Fabrizio',
      ultimaVisita: '05/11/2023',
      proximaVisita: '05/02/2024',
      imagen: 'assets/images/animals/toro1.jpg'
    }
  ];
  
  filteredPatients: Patient[] = [];
  animalTypes = ['Todos', 'Vaca', 'Toro', 'Cabra', 'Oveja'];
  selectedFilters = {
    type: 'Todos'
  };
  
  upcomingAppointments = [
    {
      id: 1,
      patientName: 'Bella',
      ownerName: 'Gary',
      date: '20/12/2023',
      time: '10:00',
      reason: 'Seguimiento cojera'
    },
    {
      id: 2,
      patientName: 'Clery',
      ownerName: 'Rodrigo',
      date: '15/01/2024',
      time: '09:30',
      reason: 'Revisión rutinaria'
    }
  ];

  constructor(
    private translate: TranslateService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
      this.translate.use(savedLang);
    }
  
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.name;
      this.patientCount = `${this.patients.length} pacientes`;
    }
    
    this.filteredPatients = [...this.patients];
  }
  
  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }
  
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }
  
  searchPatients(): void {
    if (!this.searchTerm.trim()) {
      this.applyFilters();
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredPatients = this.patients.filter(patient => 
      patient.nombre.toLowerCase().includes(term) || 
      patient.propietario.toLowerCase().includes(term)
    );
  }
  
  applyFilters(): void {
    let filtered = [...this.patients];
    
    if (this.selectedFilters.type !== 'Todos') {
      filtered = filtered.filter(patient => 
        patient.tipo.toLowerCase().includes(this.selectedFilters.type.toLowerCase())
      );
    }
    
    this.filteredPatients = filtered;
    this.toggleFilters();
  }
  
  resetFilters(): void {
    this.selectedFilters = {
      type: 'Todos'
    };
    this.filteredPatients = [...this.patients];
    this.toggleFilters();
  }
  
  logout(): void {
    this.authService.logout();
  }
}
