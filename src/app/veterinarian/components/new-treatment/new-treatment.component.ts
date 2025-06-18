import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../public/services/auth.service';
import { FooterComponentComponent } from '../../../public/components/footer-component/footer-component.component';
import { HeaderComponent } from '../../../public/components/header-component/header-component.component';
import { TreatmentService, Treatment } from '../../services/treatments.service';

@Component({
  selector: 'app-new-treatment',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
    FooterComponentComponent,
    HeaderComponent
  ],
  templateUrl: './new-treatment.component.html',
  styleUrls: ['./new-treatment.component.css']
})
export class NewTreatmentComponent implements OnInit {
  treatmentForm!: FormGroup;
  isSubmitting = false;
  submitError = '';
  userName = '';
  categories = ['preventive', 'therapeutic', 'maintenance', 'emergency'];
  animalTypes = ['Vaca', 'Toro', 'Cabra', 'Oveja', 'Caballo', 'Ternero'];
  
  constructor(
    private fb: FormBuilder,
    private treatmentService: TreatmentService,
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
    
    this.initForm();
  }
  
  initForm(): void {
    this.treatmentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      category: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(200)]],
      price: ['', [Validators.required, Validators.min(0)]],
      duration: ['', Validators.required],
      materials: this.fb.array([this.createMaterialControl()]),
      steps: this.fb.array([this.createStepControl()]),
      animalTypes: this.fb.array([]),
      image: ['', Validators.required]
    });
  }
  
  createMaterialControl(): FormControl {
    return this.fb.control('', Validators.required);
  }
  
  createStepControl(): FormControl {
    return this.fb.control('', Validators.required);
  }
  
  get materialsArray(): FormArray {
    return this.treatmentForm.get('materials') as FormArray;
  }
  
  get stepsArray(): FormArray {
    return this.treatmentForm.get('steps') as FormArray;
  }
  
  get animalTypesArray(): FormArray {
    return this.treatmentForm.get('animalTypes') as FormArray;
  }
  
  addMaterial(): void {
    this.materialsArray.push(this.createMaterialControl());
  }
  
  removeMaterial(index: number): void {
    if (this.materialsArray.length > 1) {
      this.materialsArray.removeAt(index);
    }
  }
  
  addStep(): void {
    this.stepsArray.push(this.createStepControl());
  }
  
  removeStep(index: number): void {
    if (this.stepsArray.length > 1) {
      this.stepsArray.removeAt(index);
    }
  }
  
  onAnimalTypeChange(event: any, animalType: string): void {
    const animalTypesArray = this.animalTypesArray;
    
    if (event.target.checked) {
      animalTypesArray.push(this.fb.control(animalType));
    } else {
      const index = animalTypesArray.controls.findIndex(control => control.value === animalType);
      if (index !== -1) {
        animalTypesArray.removeAt(index);
      }
    }
  }
  
  isAnimalTypeSelected(animalType: string): boolean {
    const animalTypesArray = this.animalTypesArray;
    return animalTypesArray.controls.some(control => control.value === animalType);
  }
  
  onSubmit(): void {
    console.log('Form submission started');
    console.log('Form valid:', this.treatmentForm.valid);
    console.log('Form value:', this.treatmentForm.value);
    
    if (this.treatmentForm.invalid) {
      this.markFormGroupTouched(this.treatmentForm);
      this.submitError = 'Por favor, complete todos los campos requeridos';
      console.log('Form is invalid');
      return;
    }
    
    if (this.animalTypesArray.length === 0) {
      this.submitError = 'Debe seleccionar al menos un tipo de animal';
      console.log('No animal types selected');
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
    
    // Preparar los datos según las especificaciones del backend
    const formValue = this.treatmentForm.value;
    
    // Convertir categoría a mayúsculas según especificaciones
    const categoryMapping: { [key: string]: string } = {
      'preventive': 'PREVENTIVO',
      'therapeutic': 'TERAPEUTICO', 
      'maintenance': 'MANTENIMIENTO',
      'emergency': 'EMERGENCIA'
    };
    
    const treatmentData = {
      name: formValue.name?.trim(),
      category: categoryMapping[formValue.category] || formValue.category?.toUpperCase(),
      description: formValue.description?.trim(),
      price: parseFloat(formValue.price),
      duration: formValue.duration?.trim(),
      materials: formValue.materials?.filter((material: string) => material?.trim()) || [],
      steps: formValue.steps?.filter((step: string) => step?.trim()) || [],
      animalTypes: formValue.animalTypes || [],
      image: formValue.image?.trim() || '',
      createdBy: currentUser.id
    };
    
    console.log('Sending treatment data:', treatmentData);
    
    this.treatmentService.addTreatment(treatmentData).subscribe({
      next: (response) => {
        console.log('Treatment created successfully:', response);
        this.isSubmitting = false;
        this.router.navigate(['/veterinarian/treatments']);
      },
      error: (error) => {
        console.error('Error adding treatment:', error);
        this.isSubmitting = false;
        
        // Manejo de errores más específico
        if (error.status === 400) {
          this.submitError = 'Datos inválidos. Verifique que todos los campos estén correctamente completados.';
        } else if (error.status === 403) {
          this.submitError = 'No tiene permisos para crear tratamientos.';
        } else if (error.status === 401) {
          this.submitError = 'Sesión expirada. Por favor, inicie sesión nuevamente.';
          this.router.navigate(['/login']);
        } else if (error.status === 500) {
          this.submitError = 'Error del servidor. Por favor, inténtelo más tarde.';
        } else {
          this.submitError = 'Error al guardar el tratamiento. Por favor, inténtelo de nuevo.';
        }
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
    this.router.navigate(['/veterinarian/treatments']);
  }
}
