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
    if (this.treatmentForm.invalid) {
      this.markFormGroupTouched(this.treatmentForm);
      return;
    }
    
    if (this.animalTypesArray.length === 0) {
      this.submitError = 'Debe seleccionar al menos un tipo de animal';
      return;
    }
    
    this.isSubmitting = true;
    this.submitError = '';
    
    const treatmentData = this.treatmentForm.value;
    
    this.treatmentService.addTreatment(treatmentData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/veterinarian/treatments']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.submitError = 'Error al guardar el tratamiento. Por favor, inténtelo de nuevo.';
        console.error('Error adding treatment:', error);
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
