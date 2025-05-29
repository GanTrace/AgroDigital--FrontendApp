import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../public/services/auth.service';
import { FooterComponentComponent } from '../../../public/components/footer-component/footer-component.component';
import { HeaderComponent } from '../../../public/components/header-component/header-component.component';
import { AppointmentService } from '../../services/appointment.service';
import { PatientService, Patient } from '../../services/patient.service';

@Component({
  selector: 'app-new-appointment',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
    FooterComponentComponent,
    HeaderComponent
  ],
  templateUrl: './new-appointment.component.html',
  styleUrls: ['./new-appointment.component.css']
})
export class NewAppointmentComponent implements OnInit {
  appointmentForm!: FormGroup;
  isSubmitting = false;
  submitError = '';
  userName = '';
  patients: Patient[] = [];
  isLoadingPatients = false;
  loadPatientsError = '';
  
  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private router: Router,
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
    this.appointmentForm = this.fb.group({
      patientId: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      reason: ['', Validators.required],
      notes: ['']
    });
  }
  
  onPatientChange(): void {
    const patientId = this.appointmentForm.get('patientId')?.value;
    if (patientId) {
      const selectedPatient = this.patients.find(p => p.id === parseInt(patientId));
      if (selectedPatient) {
        // Podríamos pre-llenar otros campos si fuera necesario
      }
    }
  }
  
  onSubmit(): void {
    if (this.appointmentForm.invalid) {
      this.markFormGroupTouched(this.appointmentForm);
      return;
    }
    
    this.isSubmitting = true;
    this.submitError = '';
    
    const formData = this.appointmentForm.value;
    const patientId = parseInt(formData.patientId);
    const selectedPatient = this.patients.find(p => p.id === patientId);
    
    if (!selectedPatient) {
      this.submitError = 'Paciente no encontrado';
      this.isSubmitting = false;
      return;
    }
    
    const appointmentData = {
      patientId: patientId,
      patientName: selectedPatient.name,
      ownerName: selectedPatient.owner,
      date: formData.date,
      time: formData.time,
      reason: formData.reason,
      status: 'scheduled' as 'scheduled' | 'completed' | 'cancelled',
      notes: formData.notes || ''
    };
    
    this.appointmentService.addAppointment(appointmentData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/veterinarian/medical-appointments']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.submitError = 'Error al guardar la cita. Por favor, inténtelo de nuevo.';
        console.error('Error adding appointment:', error);
      }
    });
  }
  
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
  
  cancel(): void {
    this.router.navigate(['/veterinarian/medical-appointments']);
  }
}
