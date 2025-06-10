import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from '../../../public/components/header-component/header-component.component';
import { FooterComponentComponent } from '../../../public/components/footer-component/footer-component.component';
import { AuthService } from '../../../public/services/auth.service';
import { LanguageSwitcherComponent } from '../../../public/components/language-switcher/language-switcher.component';
import { AnimalService, Animal } from '../../services/animal.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TranslateModule,
    HeaderComponent,
    FooterComponentComponent,
    LanguageSwitcherComponent 
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  userName: string = '';
  animals: Animal[] = [];
  filteredAnimals: Animal[] = [];
  searchTerm: string = '';
  showFilters: boolean = false;
  selectedFilters = {
    type: '',
    sex: '',
    age: ''
  };
  animalTypes: string[] = [];
  selectedAnimal: Animal | null = null;
  showAnimalDetails: boolean = false;
  
  constructor(
    private authService: AuthService,
    private animalService: AnimalService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.name;
    }
    
    this.loadAnimals();
  }
  
  loadAnimals(): void {
    this.animalService.getAnimalsByUser().subscribe(animals => {
      this.animals = animals;
      this.filteredAnimals = [...animals];
      
      this.animalTypes = [...new Set(animals.map(animal => animal.especie))];
    });
  }
  
  searchAnimals(): void {
    if (!this.searchTerm.trim()) {
      this.filteredAnimals = [...this.animals];
      return;
    }
    
    this.animalService.searchAnimals(this.searchTerm).subscribe(results => {
      this.filteredAnimals = results;
    });
  }
  
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }
  
  applyFilters(): void {
    let filtered = [...this.animals];
    
    if (this.selectedFilters.type) {
      filtered = filtered.filter(animal => animal.especie === this.selectedFilters.type);
    }
    
    if (this.selectedFilters.sex) {
      filtered = filtered.filter(animal => animal.sexo === this.selectedFilters.sex);
    }
    
    // Additional filters can be added here
    
    this.filteredAnimals = filtered;
    this.showFilters = false;
  }
  
  resetFilters(): void {
    this.selectedFilters = {
      type: '',
      sex: '',
      age: ''
    };
    this.filteredAnimals = [...this.animals];
    this.showFilters = false;
  }
  
  viewAnimalDetails(animal: Animal): void {
    this.selectedAnimal = animal;
    this.showAnimalDetails = true;
  }
  
  closeAnimalDetails(): void {
    this.showAnimalDetails = false;
    this.selectedAnimal = null;
  }
  
  deleteAnimal(event: Event, animalId: number): void {
    event.stopPropagation();
    
    if (confirm(this.translate.instant('DASHBOARD.CONFIRM_DELETE_ANIMAL'))) {
      this.animalService.deleteAnimal(animalId).subscribe({
        next: () => {
          this.animals = this.animals.filter(animal => animal.id !== animalId);
          this.filteredAnimals = this.filteredAnimals.filter(animal => animal.id !== animalId);
        },
        error: (error) => {
          console.error('Error deleting animal:', error);
        }
      });
    }
  }
  
  calculateAge(birthDate: string): string {
    if (!birthDate) return '';
    
    const birth = new Date(birthDate);
    const now = new Date();
    
    let years = now.getFullYear() - birth.getFullYear();
    const monthDiff = now.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
      years--;
    }
    
    return `${years} ${this.translate.instant('DASHBOARD.YEARS')}`;
  }
}
