import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../public/services/auth.service';
import { FooterComponentComponent } from '../../../public/components/footer-component/footer-component.component';
import { HeaderComponent } from '../../../public/components/header-component/header-component.component';
import { PatientService, Patient } from '../../services/patient.service';
import { UserService } from '../../../public/services/user.service';
import { AnimalService, Animal } from '../../../rancher/services/animal.service';
import { User } from '../../../public/services/auth.service';

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
  
  // Propiedades para el flujo de selección
  currentStep = 1; // 1: Seleccionar propietario, 2: Seleccionar animal, 3: Ver pacientes
  owners: User[] = [];
  selectedOwner: User | null = null;
  ownerAnimals: Animal[] = [];
  selectedAnimal: Animal | null = null;
  
  filteredOwners: User[] = [];
  animalSearchTerm = '';
  filteredAnimals: Animal[] = [];
  
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
    private userService: UserService,
    private animalService: AnimalService,
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
    
    this.loadOwners();
  }
  
  loadOwners(): void {
    this.isLoading = true;
    this.loadError = '';
    
    this.userService.getUsersByRole('rancher').subscribe({
      next: (owners) => {
        this.owners = owners;
        this.filteredOwners = [...this.owners];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading owners:', error);
        this.loadError = 'Error al cargar los propietarios. Por favor, inténtelo de nuevo.';
        this.isLoading = false;
      }
    });
  }
  
  selectOwner(owner: User): void {
    this.selectedOwner = owner;
    this.loadOwnerAnimals(owner.id!);
    this.currentStep = 2;
  }
  
  loadOwnerAnimals(ownerId: number): void {
    this.isLoading = true;
    this.loadError = '';
    
    this.animalService.getAnimalsByUserId(ownerId).subscribe({
      next: (animals) => {
        this.ownerAnimals = animals;
        this.filteredAnimals = [...this.ownerAnimals];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading animals:', error);
        this.loadError = 'Error al cargar los animales. Por favor, inténtelo de nuevo.';
        this.isLoading = false;
      }
    });
  }
  
  selectAnimal(animal: Animal): void {
    this.selectedAnimal = animal;
    this.currentStep = 3;
  }
  
  addAsPatient(): void {
    if (this.selectedAnimal && this.selectedOwner) {
      // Navegar al formulario de nuevo paciente con los datos preseleccionados
      this.router.navigate(['/veterinarian/new-patient'], { 
        queryParams: { 
          animalId: this.selectedAnimal.id,
          animalName: this.selectedAnimal.nombre,
          animalType: this.selectedAnimal.especie,
          animalSex: this.selectedAnimal.sexo,
          animalImage: this.selectedAnimal.imagen || this.selectedAnimal.imageUrl,
          ownerId: this.selectedOwner.id,
          ownerName: this.selectedOwner.name
        } 
      });
    }
  }
  
  backToOwners(): void {
    this.currentStep = 1;
    this.selectedOwner = null;
    this.selectedAnimal = null;
  }
  
  backToAnimals(): void {
    this.currentStep = 2;
    this.selectedAnimal = null;
  }
  
  loadPatients(): void {
    this.isLoading = true;
    this.loadError = '';
    
    this.patientService.getPatientsByUser().subscribe({
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
  
  // Métodos de búsqueda y filtrado
  searchOwners(): void {
    if (!this.searchTerm.trim()) {
      this.filteredOwners = [...this.owners];
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredOwners = this.owners.filter(owner => 
      owner.name.toLowerCase().includes(term) || 
      owner.email.toLowerCase().includes(term)
    );
  }

  searchAnimals(): void {
    if (!this.animalSearchTerm.trim()) {
      this.filteredAnimals = [...this.ownerAnimals];
      return;
    }
    
    const term = this.animalSearchTerm.toLowerCase();
    this.filteredAnimals = this.ownerAnimals.filter(animal => 
      animal.nombre.toLowerCase().includes(term) || 
      animal.especie.toLowerCase().includes(term)
    );
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
    }
  }
  
  addNewPatient(): void {
    this.router.navigate(['/veterinarian/new-patient']);
  }
  
  getHealthStatusClass(healthIssues: string): string {
    return healthIssues === 'Ninguno' ? 'status-healthy' : 'status-treatment';
  }

  deletePatient(id: number | undefined, event: Event): void {
    event.stopPropagation();
    
    if (id === undefined) {
      console.error('ID de paciente no válido');
      return;
    }
    
    if (confirm('¿Estás seguro de que deseas eliminar este paciente?')) {
      this.patientService.deletePatient(id).subscribe({
        next: () => {
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
