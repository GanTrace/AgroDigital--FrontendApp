import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../public/services/auth.service';
import { FooterComponentComponent } from '../../../public/components/footer-component/footer-component.component';
import { HeaderComponent } from '../../../public/components/header-component/header-component.component';
import { MedicalRecordService, MedicalRecord } from '../../services/medical-record.service';
import { PatientService, Patient } from '../../services/patient.service';



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
  selectedPatient: Patient | null = null; 
  isLoading = false;
  loadError = '';
  
  selectedRecord: MedicalRecord | null = null;
  showRecordDetails = false;
  
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
  
  patients: Patient[] = [];
  medicalRecords: MedicalRecord[] = [];
  filteredRecords: MedicalRecord[] = [];
  
  constructor(
    private translate: TranslateService,
    private authService: AuthService,
    private router: Router,
    private medicalRecordService: MedicalRecordService,
    private patientService: PatientService
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
    this.patientService.getPatientsByUser().subscribe({ 
      next: (patients) => {
        this.patients = patients;
      },
      error: (error) => {
        console.error('Error loading patients:', error);
      }
    });
  }
  
  selectPatient(patientId: number | undefined): void {
    if (patientId === undefined) return;
    
    this.selectedPatientId = patientId;
    this.selectedPatient = this.patients.find(p => p.id === patientId) || null;
    
    this.loadMedicalRecords();
  }
  
  clearSelectedPatient(): void {
    this.selectedPatientId = null;
    this.selectedPatient = null;
    this.filteredRecords = [];
  }
  
  loadMedicalRecords(): void {
    if (!this.selectedPatientId) {
      this.filteredRecords = [];
      return;
    }
    
    this.isLoading = true;
    this.loadError = '';
    
    this.medicalRecordService.getMedicalRecordsByUser().subscribe({
      next: (records) => {
        this.medicalRecords = records;
        this.filteredRecords = this.medicalRecords.filter(
          record => record.patientId === this.selectedPatientId
        );
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading medical records:', error);
        this.loadError = 'Error al cargar los registros médicos. Por favor, inténtelo de nuevo.';
        this.isLoading = false;
      }
    });
  }
  
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }
  
  searchRecords(): void {
    if (!this.searchTerm.trim()) {
      this.filteredRecords = this.medicalRecords.filter(
        record => record.patientId === this.selectedPatientId
      );
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredRecords = this.medicalRecords.filter(record => 
      record.patientId === this.selectedPatientId &&
      (record.diagnosis.toLowerCase().includes(term) ||
       record.treatment.toLowerCase().includes(term) ||
       record.recordType.toLowerCase().includes(term))
    );
  }
  
  getHealthStatusClass(healthIssues: string): string {
    return healthIssues === 'Ninguno' ? 'status-healthy' : 'status-treatment';
  }
  
  addNewRecord(): void {
    if (this.selectedPatientId) {
      this.router.navigate(['/veterinarian/new-record'], {
        queryParams: { patientId: this.selectedPatientId }
      });
    }
  }
  
  deleteRecord(recordId: number): void {
    if (confirm(this.translate.instant('VET_MEDICAL_RECORDS.DELETE_CONFIRM'))) {
      this.medicalRecordService.deleteMedicalRecord(recordId).subscribe({
        next: () => {
          this.medicalRecords = this.medicalRecords.filter(record => record.id !== recordId);
          this.filteredRecords = this.filteredRecords.filter(record => record.id !== recordId);
          
          if (this.selectedRecord && this.selectedRecord.id === recordId) {
            this.closeRecordDetails();
          }
        },
        error: (error) => {
          console.error(`Error deleting medical record with id ${recordId}:`, error);
        }
      });
    }
  }
  
  viewRecordDetails(recordId: number): void {
    this.medicalRecordService.getMedicalRecord(recordId).subscribe({
      next: (record) => {
        this.selectedRecord = record;
        this.showRecordDetails = true;
      },
      error: (error) => {
        console.error(`Error fetching medical record with id ${recordId}:`, error);
      }
    });
  }
  
  closeRecordDetails(): void {
    this.showRecordDetails = false;
    this.selectedRecord = null;
  }
}
