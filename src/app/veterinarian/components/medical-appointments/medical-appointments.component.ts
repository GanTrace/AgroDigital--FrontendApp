import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../public/services/auth.service';
import { FooterComponentComponent } from '../../../public/components/footer-component/footer-component.component';
import { HeaderComponent } from '../../../public/components/header-component/header-component.component';

interface Appointment {
  id: number;
  patientId: number;
  patientName: string;
  ownerName: string;
  date: string;
  time: string;
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string;
}

@Component({
  selector: 'app-medical-appointments',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TranslateModule,
    FooterComponentComponent,
    HeaderComponent
  ],
  templateUrl: './medical-appointments.component.html',
  styleUrls: ['./medical-appointments.component.css']
})
export class MedicalAppointmentsComponent implements OnInit {
  userName = '';
  searchTerm = '';
  showFilters = false;
  selectedDate: string = '';
  selectedStatus: string = 'all';
  
  appointments: Appointment[] = [
    {
      id: 1,
      patientId: 1,
      patientName: 'Clery',
      ownerName: 'Rodrigo',
      date: '15/12/2023',
      time: '10:00',
      reason: 'Revisión general',
      status: 'scheduled',
      notes: 'Primera revisión del mes'
    },
    {
      id: 2,
      patientId: 2,
      patientName: 'Bella',
      ownerName: 'Gary',
      date: '16/12/2023',
      time: '11:30',
      reason: 'Vacunación',
      status: 'scheduled',
      notes: 'Vacuna anual'
    },
    {
      id: 3,
      patientId: 3,
      patientName: 'Max',
      ownerName: 'Nelson Fabrizio',
      date: '14/12/2023',
      time: '09:15',
      reason: 'Seguimiento de tratamiento',
      status: 'completed',
      notes: 'Verificar evolución del tratamiento anterior'
    },
    {
      id: 4,
      patientId: 1,
      patientName: 'Clery',
      ownerName: 'Rodrigo',
      date: '20/12/2023',
      time: '15:45',
      reason: 'Control de peso',
      status: 'scheduled',
      notes: 'Seguimiento nutricional'
    }
  ];
  
  filteredAppointments: Appointment[] = [];
  
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
    }
    
    this.filteredAppointments = [...this.appointments];
  }
  
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }
  
  searchAppointments(): void {
    if (!this.searchTerm.trim()) {
      this.applyFilters();
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredAppointments = this.appointments.filter(appointment => 
      appointment.patientName.toLowerCase().includes(term) || 
      appointment.ownerName.toLowerCase().includes(term) ||
      appointment.reason.toLowerCase().includes(term)
    );
  }
  
  applyFilters(): void {
    let filtered = [...this.appointments];
    
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(appointment => 
        appointment.status === this.selectedStatus
      );
    }
    
    if (this.selectedDate) {
      filtered = filtered.filter(appointment => 
        appointment.date === this.selectedDate
      );
    }
    
    this.filteredAppointments = filtered;
    this.toggleFilters();
  }
  
  resetFilters(): void {
    this.selectedStatus = 'all';
    this.selectedDate = '';
    this.filteredAppointments = [...this.appointments];
  }
  
  addNewAppointment(): void {
    this.router.navigate(['/veterinarian/new-appointment']);
  }
  
  editAppointment(id: number): void {
    this.router.navigate([`/veterinarian/edit-appointment/${id}`]);
  }
  
  cancelAppointment(id: number): void {
    const appointment = this.appointments.find(a => a.id === id);
    if (appointment) {
      appointment.status = 'cancelled';
      this.applyFilters();
    }
  }
  
  completeAppointment(id: number): void {
    const appointment = this.appointments.find(a => a.id === id);
    if (appointment) {
      appointment.status = 'completed';
      this.applyFilters();
    }
  }
  
  getStatusClass(status: string): string {
    switch(status) {
      case 'scheduled': return 'status-scheduled';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  }
}
