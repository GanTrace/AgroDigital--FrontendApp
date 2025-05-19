import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../public/services/auth.service';
import { FooterComponentComponent } from '../../../public/components/footer-component/footer-component.component';
import { HeaderComponent } from '../../../public/components/header-component/header-component.component';

interface Treatment {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  duration: string;
  materials: string[];
  steps: string[];
  animalTypes: string[];
  image: string;
}

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
  
  treatments: Treatment[] = [
    {
      id: 1,
      name: 'Vacunación Estándar',
      category: 'preventive',
      description: 'Vacunación preventiva para ganado bovino contra enfermedades comunes.',
      price: 45.00,
      duration: '15-20 minutos',
      materials: ['Vacuna', 'Jeringa desechable', 'Alcohol', 'Algodón', 'Guantes'],
      steps: [
        'Verificar la identidad y el historial del animal',
        'Preparar la vacuna según las instrucciones del fabricante',
        'Desinfectar el área de inyección',
        'Administrar la vacuna por vía subcutánea o intramuscular según corresponda',
        'Registrar la vacunación en el historial médico del animal',
        'Programar la próxima vacunación si es necesario'
      ],
      animalTypes: ['Vaca', 'Toro', 'Ternero'],
      image: 'assets/images/treatments/vaccination.jpg'
    },
    {
      id: 2,
      name: 'Desparasitación',
      category: 'preventive',
      description: 'Tratamiento para eliminar parásitos internos y externos en animales de granja.',
      price: 35.00,
      duration: '10-15 minutos',
      materials: ['Antiparasitario', 'Jeringa dosificadora', 'Guantes', 'Registro de peso'],
      steps: [
        'Pesar al animal para calcular la dosis correcta',
        'Preparar el antiparasitario según el peso del animal',
        'Administrar el medicamento por vía oral o inyectable según el tipo',
        'Registrar el tratamiento en el historial médico',
        'Programar el siguiente tratamiento según el ciclo recomendado'
      ],
      animalTypes: ['Vaca', 'Toro', 'Cabra', 'Oveja', 'Caballo'],
      image: 'assets/images/treatments/deworming.jpg'
    },
    {
      id: 3,
      name: 'Tratamiento de Mastitis',
      category: 'therapeutic',
      description: 'Tratamiento para la inflamación de la ubre causada por infección bacteriana.',
      price: 65.00,
      duration: '30-45 minutos',
      materials: ['Antibiótico intramamario', 'Guantes estériles', 'Toallas desinfectantes', 'Sellador de pezones', 'Registro de producción de leche'],
      steps: [
        'Examinar la ubre para identificar los cuartos afectados',
        'Limpiar y desinfectar los pezones afectados',
        'Extraer y descartar la leche contaminada',
        'Administrar antibiótico intramamario en los cuartos afectados',
        'Aplicar sellador de pezones',
        'Registrar el tratamiento y marcar al animal como en tratamiento',
        'Programar seguimiento para evaluar la respuesta al tratamiento'
      ],
      animalTypes: ['Vaca'],
      image: 'assets/images/treatments/mastitis.jpg'
    },
    {
      id: 4,
      name: 'Recorte de Pezuñas',
      category: 'maintenance',
      description: 'Procedimiento para mantener la salud de las pezuñas y prevenir cojeras.',
      price: 40.00,
      duration: '20-30 minutos por animal',
      materials: ['Tijeras de recorte', 'Lima', 'Guantes de trabajo', 'Bota de inmovilización', 'Desinfectante'],
      steps: [
        'Inmovilizar al animal de forma segura',
        'Limpiar las pezuñas para eliminar suciedad y materia fecal',
        'Recortar el exceso de crecimiento de la pezuña',
        'Nivelar la superficie de apoyo',
        'Aplicar desinfectante si es necesario',
        'Liberar al animal y observar su marcha'
      ],
      animalTypes: ['Vaca', 'Toro', 'Cabra', 'Oveja'],
      image: 'assets/images/treatments/hoof_trimming.jpg'
    },
    {
      id: 5,
      name: 'Asistencia en Parto',
      category: 'emergency',
      description: 'Asistencia veterinaria durante partos difíciles o complicados.',
      price: 120.00,
      duration: '1-3 horas',
      materials: ['Guantes obstétricos largos', 'Lubricante obstétrico', 'Cuerdas obstétricas', 'Desinfectante', 'Antibiótico', 'Equipo de emergencia'],
      steps: [
        'Evaluar la posición del feto y la dilatación',
        'Preparar el área perineal con desinfectante',
        'Aplicar lubricante obstétrico',
        'Corregir la posición del feto si es necesario',
        'Asistir en la extracción con tracción controlada si es necesario',
        'Verificar la expulsión completa de la placenta',
        'Administrar antibióticos preventivos si es necesario',
        'Asegurar que la madre atienda al recién nacido'
      ],
      animalTypes: ['Vaca', 'Cabra', 'Oveja'],
      image: 'assets/images/treatments/calving.jpg'
    }
  ];
  
  filteredTreatments: Treatment[] = [];
  categories = ['all', 'preventive', 'therapeutic', 'maintenance', 'emergency'];
  animalTypes = ['all', 'Vaca', 'Toro', 'Cabra', 'Oveja', 'Caballo', 'Ternero'];
  
  constructor(
    private translate: TranslateService,
    private authService: AuthService,
    private router: Router
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
    
    this.filteredTreatments = [...this.treatments];
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
  
  viewTreatmentDetails(id: number): void {
    this.selectedTreatment = this.treatments.find(t => t.id === id) || null;
    this.showTreatmentDetails = true;
  }
  
  closeTreatmentDetails(): void {
    this.showTreatmentDetails = false;
    this.selectedTreatment = null;
  }
  
  addNewTreatment(): void {
    this.router.navigate(['/veterinarian/new-treatment']);
  }
  
  editTreatment(id: number): void {
    this.router.navigate([`/veterinarian/edit-treatment/${id}`]);
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
}
