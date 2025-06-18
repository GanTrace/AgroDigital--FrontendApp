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
    
    this.patientService.getPatientsByUser().subscribe({
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
    console.log('Form submission started');
    console.log('Form valid:', this.recordForm.valid);
    console.log('Form value:', this.recordForm.value);
    
    if (this.recordForm.invalid) {
      this.markFormGroupTouched(this.recordForm);
      this.submitError = 'Por favor, complete todos los campos requeridos';
      console.log('Form is invalid');
      return;
    }
    
    // Verificar que el usuario esté autenticado
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      this.submitError = 'Error de autenticación. Por favor, inicie sesión nuevamente.';
      console.log('User not authenticated');
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
      console.log('Patient not found');
      return;
    }
    
    // Obtener el valor traducido del tipo de registro
     const translatedRecordType = this.translate.instant(formData.recordType);
    
    // Preparar datos según especificaciones del backend
    const recordData = {
      patientId: patientId,
      patientName: selectedPatient.name?.trim(),
      ownerName: selectedPatient.owner?.trim(),
      date: formData.date,
      recordType: translatedRecordType,
      diagnosis: formData.diagnosis?.trim(),
      treatment: formData.treatment?.trim(),
      notes: formData.notes?.trim() || '',
      followUp: formData.followUp,
      attachments: [],
      createdBy: currentUser.id
    };
    
    console.log('Sending medical record data:', recordData);
    
    this.medicalRecordService.addMedicalRecord(recordData).subscribe({
      next: (response) => {
        console.log('Medical record created successfully:', response);
        this.isSubmitting = false;
        this.router.navigate(['/veterinarian/medical-records']);
      },
      error: (error) => {
        console.error('Error adding medical record:', error);
        this.isSubmitting = false;
        
        // Manejo de errores más específico
        if (error.status === 400) {
          this.submitError = 'Datos inválidos. Verifique que todos los campos estén correctamente completados.';
        } else if (error.status === 403) {
          this.submitError = 'No tiene permisos para crear registros médicos.';
        } else if (error.status === 401) {
          this.submitError = 'Sesión expirada. Por favor, inicie sesión nuevamente.';
          this.router.navigate(['/login']);
        } else if (error.status === 500) {
          this.submitError = 'Error del servidor. Por favor, inténtelo más tarde.';
        } else {
          this.submitError = 'Error al guardar el registro médico. Por favor, inténtelo de nuevo.';
        }
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
