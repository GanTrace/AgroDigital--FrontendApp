import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from '../../../public/components/header-component/header-component.component';
import { FooterComponentComponent } from '../../../public/components/footer-component/footer-component.component';
import { AnimalService, Animal } from '../../services/animal.service';
import { MedicalHistoryService } from '../../services/medical-history.service';

@Component({
  selector: 'app-medical-history',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TranslateModule,
    HeaderComponent,
    FooterComponentComponent
  ],
  templateUrl: './medical-history.component.html',
  styleUrls: ['./medical-history.component.css']
})
export class MedicalHistoryComponent implements OnInit {
  animals: Animal[] = [];
  selectedAnimal: Animal | null = null;
  medicalEvents: any[] = [];
  searchTerm: string = '';
  filteredAnimals: Animal[] = [];

  constructor(
    private animalService: AnimalService,
    private medicalHistoryService: MedicalHistoryService,
    private translate: TranslateService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
      this.translate.use(savedLang);
    }
    
    this.loadAnimals();
  }

  loadAnimals(): void {
    this.animalService.getAnimalsByUser().subscribe(animals => {
      this.animals = animals;
      this.filteredAnimals = [...animals];
    });
  }

  searchAnimals(): void {
    if (!this.searchTerm.trim()) {
      this.filteredAnimals = [...this.animals];
      return;
    }
    
    this.filteredAnimals = this.animals.filter(animal => 
      animal.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      animal.id.toString().includes(this.searchTerm)
    );
  }

  selectAnimal(animal: Animal): void {
    this.selectedAnimal = animal;
    this.loadMedicalEvents(animal.id);
  }

  loadMedicalEvents(animalId: number): void {
    this.medicalHistoryService.getMedicalEvents(animalId).subscribe(events => {
      this.medicalEvents = events;
    });
  }

  calculateAge(birthDate: string): string {
    if (!birthDate) return 'N/A';
    
    const birth = new Date(birthDate);
    const today = new Date();
    
    let years = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      years--;
    }
    
    return `${years} ${this.translate.instant('ANIMALS.YEARS')}`;
  }

  addVisit(): void {
    if (this.selectedAnimal) {
      this.router.navigate(['/add-medical-event', this.selectedAnimal.id]);
    } else {
      console.error('No animal selected');
    }
  }

  editVisit(eventId: number): void {
    console.log('Edit visit', eventId);
  }

  deleteVisit(eventId: number): void {
    if (confirm(this.translate.instant('MEDICAL_HISTORY.CONFIRM_DELETE'))) {
      this.medicalHistoryService.deleteMedicalEvent(eventId).subscribe({
        next: () => {
          // Reload events after deletion
          if (this.selectedAnimal) {
            this.loadMedicalEvents(this.selectedAnimal.id);
          }
        },
        error: (error) => {
          console.error('Error deleting medical event', error);
        }
      });
    }
  }
}
