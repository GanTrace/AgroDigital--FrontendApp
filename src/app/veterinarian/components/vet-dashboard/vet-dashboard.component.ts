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
import { PatientService, Patient } from '../../services/patient.service';
import { AppointmentService, Appointment } from '../../services/appointment.service';
import { PatientEventService } from '../../services/patient-event.service';


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
  isLoading = true;
  loadError = '';
  
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  animalTypes = ['Todos', 'Vaca', 'Toro', 'Cabra', 'Oveja'];
  selectedFilters = {
    type: 'Todos'
  };
  
  upcomingAppointments: Appointment[] = [];
  isLoadingAppointments = false;
  appointmentsError = '';

  constructor(
    private translate: TranslateService,
    private authService: AuthService,
    private router: Router,
    private patientService: PatientService,
    private appointmentService: AppointmentService,
    private patientEventService: PatientEventService
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
    
    this.loadPatients();
    this.loadUpcomingAppointments();
    
    // Suscribirse a eventos de pacientes añadidos
    this.patientEventService.patientAdded$.subscribe(newPatient => {
      this.patients.push(newPatient);
      this.filteredPatients = [...this.patients];
      
      // Actualizar el contador de pacientes
      if (this.patients.length === 1) {
        this.patientCount = `1 ${this.translate.instant('PATIENTS.PATIENT_SINGULAR')}`;
      } else {
        this.patientCount = `${this.patients.length} ${this.translate.instant('PATIENTS.PATIENT_PLURAL')}`;
      }
    });
  }
  
  loadPatients(): void {
    this.isLoading = true;
    this.loadError = '';
    
    this.patientService.getPatientsByUser().subscribe({  // Cambiado de getPatients() a getPatientsByUser()
      next: (patients) => {
        this.patients = patients;
        this.filteredPatients = [...this.patients];
        this.isLoading = false;
        
        // Actualizar el contador de pacientes
        if (this.patients.length === 1) {
          this.patientCount = `1 ${this.translate.instant('PATIENTS.PATIENT_SINGULAR')}`;
        } else {
          this.patientCount = `${this.patients.length} ${this.translate.instant('PATIENTS.PATIENT_PLURAL')}`;
        }
      },
      error: (error) => {
        console.error('Error loading patients:', error);
        this.loadError = 'Error al cargar los pacientes. Por favor, inténtelo de nuevo.';
        this.isLoading = false;
      }
    });
  }
  
  loadUpcomingAppointments(): void {
    this.isLoadingAppointments = true;
    this.appointmentsError = '';
    
    this.appointmentService.getAppointmentsByUser().subscribe({  // Cambiado de getAppointments() a getAppointmentsByUser()
      next: (appointments) => {
        // Filtrar solo las citas programadas (no canceladas ni completadas)
        const scheduledAppointments = appointments.filter(app => app.status === 'scheduled');
        
        // Ordenar por fecha y hora
        scheduledAppointments.sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time}`);
          const dateB = new Date(`${b.date}T${b.time}`);
          return dateA.getTime() - dateB.getTime();
        });
        
        // Tomar solo las próximas citas (por ejemplo, las 5 primeras)
        this.upcomingAppointments = scheduledAppointments.slice(0, 5);
        this.isLoadingAppointments = false;
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
        this.appointmentsError = 'Error al cargar las citas. Por favor, inténtelo de nuevo.';
        this.isLoadingAppointments = false;
      }
    });
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
      patient.name.toLowerCase().includes(term) || 
      patient.owner.toLowerCase().includes(term) ||
      patient.type.toLowerCase().includes(term)
    );
  }
  
  applyFilters(): void {
    let filtered = [...this.patients];
    
    if (this.selectedFilters.type !== 'Todos') {
      filtered = filtered.filter(patient => 
        patient.type.toLowerCase().includes(this.selectedFilters.type.toLowerCase())
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
  
  viewPatientDetails(id: number | undefined): void {
    if (id !== undefined) {
      this.router.navigate([`/veterinarian/patient/${id}`]);
    }
  }
  
  logout(): void {
    this.authService.logout();
  }
  
  navigateToSettings(): void {
    this.router.navigate(['/veterinarian/settings']);
  }

  // Modificar el método deletePatient para actualizar el contador
  deletePatient(id: number | undefined, event: Event): void {
    event.stopPropagation();
    
    if (id === undefined) {
      console.error('ID de paciente no válido');
      return;
    }
    
    if (confirm('¿Estás seguro de que deseas eliminar este paciente?')) {
      this.patientService.deletePatient(id).subscribe({
        next: () => {
          // Eliminar el paciente de la lista local
          this.patients = this.patients.filter(p => p.id !== id);
          this.filteredPatients = this.filteredPatients.filter(p => p.id !== id);
          
          // Actualizar el contador de pacientes
          if (this.patients.length === 1) {
            this.patientCount = `1 ${this.translate.instant('PATIENTS.PATIENT_SINGULAR')}`;
          } else {
            this.patientCount = `${this.patients.length} ${this.translate.instant('PATIENTS.PATIENT_PLURAL')}`;
          }
        },
        error: (error) => {
          console.error('Error al eliminar el paciente:', error);
        }
      });
    }
  }
}
