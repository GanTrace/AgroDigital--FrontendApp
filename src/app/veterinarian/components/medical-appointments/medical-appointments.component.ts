import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../public/services/auth.service';
import { FooterComponentComponent } from '../../../public/components/footer-component/footer-component.component';
import { HeaderComponent } from '../../../public/components/header-component/header-component.component';
import { AppointmentService, Appointment } from '../../services/appointment.service';

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
  isLoading = true;
  loadError = '';
  
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  
  constructor(
    private translate: TranslateService,
    private authService: AuthService,
    private appointmentService: AppointmentService,
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
    
    this.loadAppointments();
  }
  
  loadAppointments(): void {
    this.isLoading = true;
    this.loadError = '';
    
    this.appointmentService.getAppointments().subscribe({
      next: (appointments) => {
        this.appointments = appointments;
        this.filteredAppointments = [...this.appointments];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
        this.loadError = 'Error al cargar las citas. Por favor, inténtelo de nuevo.';
        this.isLoading = false;
      }
    });
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
  
  editAppointment(id: number | undefined): void {
    if (id !== undefined) {
      this.router.navigate([`/veterinarian/edit-appointment/${id}`]);
    }
  }
  
  cancelAppointment(id: number | undefined): void {
    if (id !== undefined) {
      const appointment = this.appointments.find(a => a.id === id);
      if (appointment) {
        appointment.status = 'cancelled';
        this.appointmentService.updateAppointment(appointment).subscribe({
          next: () => {
            this.applyFilters();
          },
          error: (error) => {
            console.error('Error cancelling appointment:', error);
          }
        });
      }
    }
  }
  
  completeAppointment(id: number | undefined): void {
    if (id !== undefined) {
      const appointment = this.appointments.find(a => a.id === id);
      if (appointment) {
        appointment.status = 'completed';
        this.appointmentService.updateAppointment(appointment).subscribe({
          next: () => {
            this.applyFilters();
          },
          error: (error) => {
            console.error('Error completing appointment:', error);
          }
        });
      }
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
