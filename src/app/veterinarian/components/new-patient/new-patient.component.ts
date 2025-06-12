import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../public/services/auth.service';
import { FooterComponentComponent } from '../../../public/components/footer-component/footer-component.component';
import { HeaderComponent } from '../../../public/components/header-component/header-component.component';
import { PatientService } from '../../services/patient.service';
import { PatientEventService } from '../../services/patient-event.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-patient',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
    FooterComponentComponent,
    HeaderComponent
  ],
  templateUrl: './new-patient.component.html',
  styleUrls: ['./new-patient.component.css']
})
export class NewPatientComponent implements OnInit {
  patientForm!: FormGroup;
  isSubmitting = false;
  submitError = '';
  userName = '';
  animalTypes = ['Vaca', 'Toro', 'Cabra', 'Oveja', 'Caballo'];
  genders = ['Macho', 'Hembra'];
  healthStatuses = ['Ninguno', 'Problemas respiratorios', 'Cojera leve', 'Infección', 'Otro'];
  
  animalId?: number;
  prefilledData: any = {};
  
  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private authService: AuthService,
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
    
    this.route.queryParams.subscribe(params => {
      if (params['animalId']) {
        this.animalId = Number(params['animalId']);
        this.prefilledData = {
          name: params['animalName'] || '',
          type: params['animalType'] || '',
          gender: params['animalSex'] === 'Macho' ? 'Macho' : params['animalSex'] === 'Hembra' ? 'Hembra' : '',
          owner: params['ownerName'] || '',
          image: params['animalImage'] || ''
        };
      }
      
      this.initForm();
    });
  }
  
  initForm(): void {
    this.patientForm = this.fb.group({
      name: [this.prefilledData.name || '', [Validators.required, Validators.minLength(2)]],
      type: [this.prefilledData.type || '', Validators.required],
      age: ['', Validators.required],
      gender: [this.prefilledData.gender || '', Validators.required],
      healthIssues: ['Ninguno', Validators.required],
      owner: [this.prefilledData.owner || '', Validators.required],
      lastVisit: ['', Validators.required],
      nextVisit: ['', Validators.required],
      image: [this.prefilledData.image || '', Validators.required],
      observations: ['']
    });
  }
  
  onSubmit(): void {
    if (this.patientForm.invalid) {
      this.markFormGroupTouched(this.patientForm);
      return;
    }
    
    this.isSubmitting = true;
    this.submitError = '';
    
    const patientData = this.patientForm.value;
    
    const user = this.authService.getCurrentUser();
    if (user) {
      patientData.createdBy = user.id;
    }
    
    this.patientService.addPatient(patientData).subscribe({
      next: (newPatient) => {
        this.isSubmitting = false;
        this.patientEventService.notifyPatientAdded(newPatient);
        this.router.navigate(['/veterinarian/patients']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.submitError = 'Error al guardar el paciente. Por favor, inténtelo de nuevo.';
        console.error('Error adding patient:', error);
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
    this.router.navigate(['/veterinarian/patients']);
  }
}
