import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../public/services/auth.service';
import { FooterComponentComponent } from '../../../public/components/footer-component/footer-component.component';
import { HeaderComponent } from '../../../public/components/header-component/header-component.component';
import { PatientService, Patient } from '../../services/patient.service';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TranslateModule,
    FooterComponentComponent,
    HeaderComponent
  ],
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {
  userName = '';
  searchTerm = '';
  showFilters = false;
  selectedAnimalType = 'all';
  selectedHealthStatus = 'all';
  
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  animalTypes = ['all', 'Vaca', 'Toro', 'Cabra', 'Oveja', 'Caballo'];
  healthStatuses = ['all', 'healthy', 'treatment'];
  isLoading = true;
  loadError = '';
  
  constructor(
    private translate: TranslateService,
    private authService: AuthService,
    private patientService: PatientService,
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
    
    this.loadPatients();
  }
  
  loadPatients(): void {
    this.isLoading = true;
    this.loadError = '';
    
    this.patientService.getPatients().subscribe({
      next: (patients) => {
        this.patients = patients;
        this.filteredPatients = [...this.patients];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading patients:', error);
        this.loadError = 'Error al cargar los pacientes. Por favor, inténtelo de nuevo.';
        this.isLoading = false;
      }
    });
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
    
    if (this.selectedAnimalType !== 'all') {
      filtered = filtered.filter(patient => 
        patient.type.includes(this.selectedAnimalType)
      );
    }
    
    if (this.selectedHealthStatus !== 'all') {
      if (this.selectedHealthStatus === 'healthy') {
        filtered = filtered.filter(patient => 
          patient.healthIssues === 'Ninguno'
        );
      } else if (this.selectedHealthStatus === 'treatment') {
        filtered = filtered.filter(patient => 
          patient.healthIssues !== 'Ninguno'
        );
      }
    }
    
    this.filteredPatients = filtered;
  }
  
  resetFilters(): void {
    this.selectedAnimalType = 'all';
    this.selectedHealthStatus = 'all';
    this.filteredPatients = [...this.patients];
  }
  
  viewPatientDetails(id: number | undefined): void {
    if (id !== undefined) {
      this.router.navigate([`/veterinarian/patient/${id}`]);
    } else {
      console.error('ID de paciente no válido');
      // Opcionalmente, puedes mostrar un mensaje al usuario
    }
  }
  
  addNewPatient(): void {
    this.router.navigate(['/veterinarian/new-patient']);
  }
  
  getHealthStatusClass(healthIssues: string): string {
    return healthIssues === 'Ninguno' ? 'status-healthy' : 'status-treatment';
  }

  deletePatient(id: number | undefined, event: Event): void {
    event.stopPropagation(); // Evitar que se active el evento de clic en la tarjeta
    
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
        },
        error: (error) => {
          console.error('Error al eliminar el paciente:', error);
        }
      });
    }
  }
}
