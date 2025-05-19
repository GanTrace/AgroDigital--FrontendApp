import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../public/services/auth.service';
import { FooterComponentComponent } from '../../../public/components/footer-component/footer-component.component';
import { HeaderComponent } from '../../../public/components/header-component/header-component.component';

interface Patient {
  id: number;
  name: string;
  type: string;
  age: string;
  gender: string;
  healthIssues: string;
  owner: string;
  lastVisit: string;
  nextVisit: string;
  image: string;
}

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
  
  patients: Patient[] = [
    {
      id: 1,
      name: 'Clery',
      type: 'Vaca Holstein',
      age: '4 años',
      gender: 'Hembra',
      healthIssues: 'Ninguno',
      owner: 'Rodrigo',
      lastVisit: '15/10/2023',
      nextVisit: '15/01/2024',
      image: 'assets/images/animals/vaca1.jpg'
    },
    {
      id: 2,
      name: 'Bella',
      type: 'Cabra Alpina',
      age: '2 años',
      gender: 'Hembra',
      healthIssues: 'Cojera leve',
      owner: 'Gary',
      lastVisit: '20/11/2023',
      nextVisit: '20/12/2023',
      image: 'assets/images/animals/cabra1.jpg'
    },
    {
      id: 3,
      name: 'Max',
      type: 'Toro Angus',
      age: '5 años',
      gender: 'Macho',
      healthIssues: 'Ninguno',
      owner: 'Nelson Fabrizio',
      lastVisit: '05/11/2023',
      nextVisit: '05/02/2024',
      image: 'assets/images/animals/toro1.jpg'
    },
    {
      id: 4,
      name: 'Luna',
      type: 'Oveja Merino',
      age: '3 años',
      gender: 'Hembra',
      healthIssues: 'Problemas respiratorios',
      owner: 'Rodrigo',
      lastVisit: '10/12/2023',
      nextVisit: '10/01/2024',
      image: 'assets/images/animals/oveja1.jpg'
    },
    {
      id: 5,
      name: 'Rocky',
      type: 'Caballo Andaluz',
      age: '7 años',
      gender: 'Macho',
      healthIssues: 'Ninguno',
      owner: 'Gary',
      lastVisit: '25/11/2023',
      nextVisit: '25/02/2024',
      image: 'assets/images/animals/caballo1.jpg'
    }
  ];
  
  filteredPatients: Patient[] = [];
  animalTypes = ['all', 'Vaca', 'Toro', 'Cabra', 'Oveja', 'Caballo'];
  healthStatuses = ['all', 'healthy', 'treatment'];
  
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
    
    this.filteredPatients = [...this.patients];
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
  
  viewPatientDetails(id: number): void {
    this.router.navigate([`/veterinarian/patient/${id}`]);
  }
  
  addNewPatient(): void {
    this.router.navigate(['/veterinarian/new-patient']);
  }
  
  getHealthStatusClass(healthIssues: string): string {
    return healthIssues === 'Ninguno' ? 'status-healthy' : 'status-treatment';
  }
}
