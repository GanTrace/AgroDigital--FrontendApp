import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from '../../../public/components/header-component/header-component.component';
import { FooterComponentComponent } from '../../../public/components/footer-component/footer-component.component';
import { AnimalService } from '../../services/animal.service';
import { MedicalHistoryService } from '../../services/medical-history.service';

@Component({
  selector: 'app-add-medical-event',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    HeaderComponent,
    FooterComponentComponent
  ],
  templateUrl: './add-medical-event.component.html',
  styleUrls: ['./add-medical-event.component.css']
})
export class AddMedicalEventComponent implements OnInit {
  medicalEventForm: FormGroup;
  animalId: number | null = null;
  animal: any = null;
  eventTypes: string[] = [
    'Vacunación',
    'Revisión',
    'Tratamiento',
    'Cirugía',
    'Parto',
    'Otro'
  ];
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private animalService: AnimalService,
    private medicalHistoryService: MedicalHistoryService
  ) {
    this.medicalEventForm = this.fb.group({
      date: [new Date().toISOString().split('T')[0], Validators.required],
      eventType: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(200)]],
      veterinarian: ['', Validators.required],
      observations: ['', Validators.maxLength(500)],
      attachments: ['']
    });
  }

  ngOnInit(): void {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
      this.translate.use(savedLang);
    }
    
    // Get animal ID from route params
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.animalId = +params['id'];
        this.loadAnimalDetails();
      } else {
        this.router.navigate(['/medical-history']);
      }
    });
  }
  
  loadAnimalDetails(): void {
    if (this.animalId) {
      // Use getAnimalsByUser and filter for the specific animal
      this.animalService.getAnimalsByUser().subscribe({
        next: (animals) => {
          const foundAnimal = animals.find(animal => animal.id === this.animalId);
          if (foundAnimal) {
            this.animal = foundAnimal;
          } else {
            console.error('Animal not found');
            this.router.navigate(['/medical-history']);
          }
        },
        error: (error: any) => {
          console.error('Error loading animal details', error);
          this.router.navigate(['/medical-history']);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.medicalEventForm.valid && this.animalId) {
      const formData = this.medicalEventForm.value;
      
      // Process attachments if needed
      let attachments: string[] = [];
      if (formData.attachments) {
        attachments = formData.attachments.split(',').map((item: string) => item.trim());
      }
      
      const medicalEvent = {
        animalId: this.animalId,
        animalName: this.animal?.nombre,
        date: formData.date,
        eventType: formData.eventType,
        description: formData.description,
        veterinarian: formData.veterinarian,
        observations: formData.observations,
        attachments: attachments
      };
      
      this.medicalHistoryService.addMedicalEvent(medicalEvent).subscribe({
        next: () => {
          this.router.navigate(['/medical-history']);
        },
        error: (error: any) => {
          console.error('Error adding medical event', error);
        }
      });
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.medicalEventForm.controls).forEach(key => {
        this.medicalEventForm.get(key)?.markAsTouched();
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/medical-history']);
  }
}
