import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../public/services/auth.service';
import { FooterComponentComponent } from '../../../public/components/footer-component/footer-component.component';
import { HeaderComponent } from '../../../public/components/header-component/header-component.component';

interface MedicalRecord {
  id: number;
  patientId: number;
  patientName: string;
  ownerName: string;
  date: string;
  recordType: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  followUp: string;
  attachments: string[];
}

@Component({
  selector: 'app-medical-records',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TranslateModule,
    FooterComponentComponent,
    HeaderComponent
  ],
  templateUrl: './medical-records.component.html',
  styleUrls: ['./medical-records.component.css']
})
export class MedicalRecordsComponent implements OnInit {
  userName = '';
  searchTerm = '';
  showFilters = false;
  selectedPatientId: number | null = null;
  
  recordTypes = [
    'VET_MEDICAL_RECORDS.RECORD_TYPES.ALL',
    'VET_MEDICAL_RECORDS.RECORD_TYPES.CHECKUP',
    'VET_MEDICAL_RECORDS.RECORD_TYPES.VACCINATION',
    'VET_MEDICAL_RECORDS.RECORD_TYPES.TREATMENT',
    'VET_MEDICAL_RECORDS.RECORD_TYPES.SURGERY',
    'VET_MEDICAL_RECORDS.RECORD_TYPES.EMERGENCY'
  ];
  
  selectedFilters = {
    recordType: 'VET_MEDICAL_RECORDS.RECORD_TYPES.ALL',
    dateFrom: '',
    dateTo: ''
  };
  
  patients = [
    {
      id: 1,
      name: 'Clery',
      owner: 'Rodrigo',
      type: 'Vaca Holstein'
    },
    {
      id: 2,
      name: 'Bella',
      owner: 'Gary',
      type: 'Cabra Alpina'
    },
    {
      id: 3,
      name: 'Max',
      owner: 'Nelson Fabrizio',
      type: 'Toro Angus'
    }
  ];
  
  medicalRecords: MedicalRecord[] = [
    {
      id: 1,
      patientId: 1,
      patientName: 'Clery',
      ownerName: 'Rodrigo',
      date: '15/10/2023',
      recordType: 'VET_MEDICAL_RECORDS.RECORD_TYPES.VACCINATION',
      diagnosis: 'Prevención de fiebre aftosa',
      treatment: 'Vacuna contra fiebre aftosa',
      notes: 'Sin reacciones adversas',
      followUp: '15/01/2024',
      attachments: ['certificado.pdf']
    },
    {
      id: 2,
      patientId: 2,
      patientName: 'Bella',
      ownerName: 'Gary',
      date: '20/11/2023',
      recordType: 'VET_MEDICAL_RECORDS.RECORD_TYPES.TREATMENT',
      diagnosis: 'Cojera leve en pata delantera izquierda',
      treatment: 'Antiinflamatorio y reposo',
      notes: 'Seguimiento en 30 días',
      followUp: '20/12/2023',
      attachments: []
    },
    {
      id: 3,
      patientId: 3,
      patientName: 'Max',
      ownerName: 'Nelson Fabrizio',
      date: '05/11/2023',
      recordType: 'VET_MEDICAL_RECORDS.RECORD_TYPES.CHECKUP',
      diagnosis: 'Estado óptimo',
      treatment: 'Ninguno',
      notes: 'Revisión rutinaria',
      followUp: '05/02/2024',
      attachments: ['informe.pdf']
    },
    {
      id: 4,
      patientId: 1,
      patientName: 'Clery',
      ownerName: 'Rodrigo',
      date: '01/09/2023',
      recordType: 'VET_MEDICAL_RECORDS.RECORD_TYPES.CHECKUP',
      diagnosis: 'Estado general bueno',
      treatment: 'Suplemento vitamínico',
      notes: 'Revisión rutinaria',
      followUp: '15/10/2023',
      attachments: []
    }
  ];
  
  filteredRecords: MedicalRecord[] = [];
  
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
    
    this.filteredRecords = [...this.medicalRecords];
  }
  
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }
  
  searchRecords(): void {
    if (!this.searchTerm.trim()) {
      this.applyFilters();
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredRecords = this.medicalRecords.filter(record => 
      record.patientName.toLowerCase().includes(term) || 
      record.ownerName.toLowerCase().includes(term) ||
      record.diagnosis.toLowerCase().includes(term) ||
      record.treatment.toLowerCase().includes(term)
    );
  }
  
  applyFilters(): void {
    let filtered = [...this.medicalRecords];
    
    if (this.selectedFilters.recordType !== 'VET_MEDICAL_RECORDS.RECORD_TYPES.ALL') {
      filtered = filtered.filter(record => 
        record.recordType === this.selectedFilters.recordType
      );
    }
    
    if (this.selectedPatientId) {
      filtered = filtered.filter(record => 
        record.patientId === this.selectedPatientId
      );
    }
    
    // Date filtering logic can be added here
    
    this.filteredRecords = filtered;
    this.toggleFilters();
  }
  
  resetFilters(): void {
    this.selectedFilters = {
      recordType: 'VET_MEDICAL_RECORDS.RECORD_TYPES.ALL',
      dateFrom: '',
      dateTo: ''
    };
    this.selectedPatientId = null;
    this.filteredRecords = [...this.medicalRecords];
    this.toggleFilters();
  }
  
  selectPatient(patientId: number): void {
    this.selectedPatientId = patientId;
    this.applyFilters();
  }
  
  addNewRecord(): void {
    // Navigate to new record form
    this.router.navigate(['/veterinarian/new-record']);
  }
  
  editRecord(recordId: number): void {
    // Navigate to edit record form
    this.router.navigate([`/veterinarian/edit-record/${recordId}`]);
  }
  
  deleteRecord(recordId: number): void {
    // Implement delete confirmation and logic
    if (confirm(this.translate.instant('VET_MEDICAL_RECORDS.DELETE_CONFIRM'))) {
      this.medicalRecords = this.medicalRecords.filter(record => record.id !== recordId);
      this.filteredRecords = this.filteredRecords.filter(record => record.id !== recordId);
    }
  }
  
  viewRecordDetails(recordId: number): void {
    // Navigate to record details
    this.router.navigate([`/veterinarian/record-details/${recordId}`]);
  }
}
