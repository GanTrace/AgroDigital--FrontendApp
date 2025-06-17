import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../public/services/auth.service';
import { FooterComponentComponent } from '../../../public/components/footer-component/footer-component.component';
import { HeaderComponent } from '../../../public/components/header-component/header-component.component';
import { MedicalRecordService } from '../../services/medical-record.service';
import { PatientService, Patient } from '../../services/patient.service';

@Component({
  selector: 'app-new-record',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
    FooterComponentComponent,
    HeaderComponent
  ],
  templateUrl: './new-record.component.html',
  styleUrls: ['./new-record.component.css']
})
export class NewRecordComponent implements OnInit {
  recordForm!: FormGroup;
  isSubmitting = false;
  submitError = '';
  userName = '';
  patients: Patient[] = [];
  isLoadingPatients = false;
  loadPatientsError = '';
  
  recordTypes = [
    'VET_MEDICAL_RECORDS.RECORD_TYPES.CHECKUP',
    'VET_MEDICAL_RECORDS.RECORD_TYPES.VACCINATION',
    'VET_MEDICAL_RECORDS.RECORD_TYPES.TREATMENT',
    'VET_MEDICAL_RECORDS.RECORD_TYPES.SURGERY',
    'VET_MEDICAL_RECORDS.RECORD_TYPES.EMERGENCY'
  ];
  
  constructor(
    private fb: FormBuilder,
    private medicalRecordService: MedicalRecordService,
    private patientService: PatientService,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private authService: AuthService
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
    this.initForm();
    
    // Check for patientId in query params
    this.route.queryParams.subscribe(params => {
      if (params['patientId']) {
        this.recordForm.patchValue({
          patientId: params['patientId']
        });
      }
    });
  }
  
  loadPatients(): void {
    this.isLoadingPatients = true;
    this.loadPatientsError = '';
    
    this.patientService.getPatients().subscribe({
      next: (patients) => {
        this.patients = patients;
        this.isLoadingPatients = false;
      },
      error: (error) => {
        console.error('Error loading patients:', error);
        this.loadPatientsError = 'Error al cargar los pacientes. Por favor, inténtelo de nuevo.';
        this.isLoadingPatients = false;
      }
    });
  }
  
  initForm(): void {
    this.recordForm = this.fb.group({
      patientId: ['', Validators.required],
      date: [this.formatDate(new Date()), Validators.required],
      recordType: ['', Validators.required],
      diagnosis: ['', Validators.required],
      treatment: ['', Validators.required],
      notes: [''],
      followUp: ['', Validators.required]
    });
  }
  
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  onPatientChange(): void {
    const patientId = this.recordForm.get('patientId')?.value;
    if (patientId) {
      const selectedPatient = this.patients.find(p => p.id === parseInt(patientId));
      if (selectedPatient) {
      }
    }
  }
  
  onSubmit(): void {
    if (this.recordForm.invalid) {
      this.markFormGroupTouched(this.recordForm);
      return;
    }
    
    this.isSubmitting = true;
    this.submitError = '';
    
    const formData = this.recordForm.value;
    const patientId = parseInt(formData.patientId);
    const selectedPatient = this.patients.find(p => p.id === patientId);
    
    if (!selectedPatient) {
      this.submitError = 'Paciente no encontrado';
      this.isSubmitting = false;
      return;
    }
    
    const recordData = {
      patientId: patientId,
      patientName: selectedPatient.name,
      ownerName: selectedPatient.owner,
      date: formData.date,
      recordType: formData.recordType.replace('VET_MEDICAL_RECORDS.RECORD_TYPES.', ''),
      diagnosis: formData.diagnosis,
      treatment: formData.treatment,
      notes: formData.notes || '',
      followUp: formData.followUp,
      attachments: []
    };
    
    this.medicalRecordService.addMedicalRecord(recordData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/veterinarian/medical-records']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.submitError = 'Error al guardar el registro médico. Por favor, inténtelo de nuevo.';
        console.error('Error adding medical record:', error);
      }
    });
  }
  
  cancel(): void {
    this.router.navigate(['/veterinarian/medical-records']);
  }
  
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
}
