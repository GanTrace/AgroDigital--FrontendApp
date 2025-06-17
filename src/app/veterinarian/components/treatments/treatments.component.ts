import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../public/services/auth.service';
import { FooterComponentComponent } from '../../../public/components/footer-component/footer-component.component';
import { HeaderComponent } from '../../../public/components/header-component/header-component.component';
import { TreatmentService, Treatment } from '../../services/treatments.service';

@Component({
  selector: 'app-treatments',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TranslateModule,
    FooterComponentComponent,
    HeaderComponent
  ],
  templateUrl: './treatments.component.html',
  styleUrls: ['./treatments.component.css']
})
export class TreatmentsComponent implements OnInit {
  userName = '';
  searchTerm = '';
  showFilters = false;
  selectedCategory = 'all';
  selectedAnimalType = 'all';
  showTreatmentDetails = false;
  selectedTreatment: Treatment | null = null;
  
  treatments: Treatment[] = [];
  filteredTreatments: Treatment[] = [];
  categories = ['all', 'preventive', 'therapeutic', 'maintenance', 'emergency'];
  animalTypes = ['all', 'Vaca', 'Toro', 'Cabra', 'Oveja', 'Caballo', 'Ternero'];
  
  constructor(
    private translate: TranslateService,
    private authService: AuthService,
    private router: Router,
    private treatmentService: TreatmentService
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
    
    this.loadTreatments();
  }
  
  loadTreatments(): void {
    this.treatmentService.getTreatments().subscribe(treatments => {
      this.treatments = treatments;
      this.filteredTreatments = [...this.treatments];
    });
  }
  
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }
  
  searchTreatments(): void {
    if (!this.searchTerm.trim()) {
      this.applyFilters();
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredTreatments = this.treatments.filter(treatment => 
      treatment.name.toLowerCase().includes(term) || 
      treatment.description.toLowerCase().includes(term)
    );
  }
  
  applyFilters(): void {
    let filtered = [...this.treatments];
    
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(treatment => 
        treatment.category === this.selectedCategory
      );
    }
    
    if (this.selectedAnimalType !== 'all') {
      filtered = filtered.filter(treatment => 
        treatment.animalTypes.includes(this.selectedAnimalType)
      );
    }
    
    this.filteredTreatments = filtered;
    this.toggleFilters();
  }
  
  resetFilters(): void {
    this.selectedCategory = 'all';
    this.selectedAnimalType = 'all';
    this.filteredTreatments = [...this.treatments];
  }
  
  viewTreatmentDetails(id: number | undefined): void {
    if (id === undefined) return;
    
    this.treatmentService.getTreatmentById(id).subscribe(treatment => {
      if (treatment) {
        this.selectedTreatment = treatment;
        this.showTreatmentDetails = true;
      }
    });
  }
  
  editTreatment(id: number | undefined): void {
    if (id === undefined) return;
    
    this.router.navigate([`/veterinarian/edit-treatment/${id}`]);
  }
  
  closeTreatmentDetails(): void {
    this.showTreatmentDetails = false;
    this.selectedTreatment = null;
  }
  
  addNewTreatment(): void {
    this.router.navigate(['/veterinarian/new-treatment']);
  }
  
  getCategoryClass(category: string): string {
    switch(category) {
      case 'preventive': return 'category-preventive';
      case 'therapeutic': return 'category-therapeutic';
      case 'maintenance': return 'category-maintenance';
      case 'emergency': return 'category-emergency';
      default: return '';
    }
  }
  
  getCategoryTranslationKey(category: string): string {
    return 'TREATMENTS.CATEGORY_' + category.toUpperCase();
  }
  
  canDeleteTreatment(treatment: Treatment): boolean {
    const currentUser = this.authService.getCurrentUser();
    return !!(currentUser && currentUser.id !== undefined && currentUser.id === treatment.createdBy);
  }
  
  deleteTreatment(id: number | undefined, treatmentName: string): void {
    if (id === undefined) return;
    
    const confirmDelete = confirm(`¿Estás seguro de que deseas eliminar el tratamiento "${treatmentName}"? Esta acción no se puede deshacer.`);
    
    if (confirmDelete) {
      this.treatmentService.deleteTreatment(id).subscribe({
        next: () => {
          // Actualizar la lista de tratamientos
          this.loadTreatments();
          alert('Tratamiento eliminado exitosamente.');
        },
        error: (error) => {
          console.error('Error al eliminar el tratamiento:', error);
          alert('Error al eliminar el tratamiento. Por favor, inténtalo de nuevo.');
        }
      });
    }
  }
}
