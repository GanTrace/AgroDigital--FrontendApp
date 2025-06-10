import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FooterComponentComponent } from '../../../public/components/footer-component/footer-component.component';
import { LanguageSwitcherComponent } from '../../../public/components/language-switcher/language-switcher.component';
import { NotificationsComponent } from '../../../public/pages/notifications/notifications.component';
import { HeaderComponent } from '../../../public/components/header-component/header-component.component';
import { AuthService } from '../../../public/services/auth.service';
import { AnimalService, Animal } from '../../services/animal.service';

@Component({
  selector: 'app-animals',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    ReactiveFormsModule,
    FooterComponentComponent,
    LanguageSwitcherComponent,
    NotificationsComponent,
    HeaderComponent 
  ],
  templateUrl: './animals.component.html',
  styleUrl: './animals.component.css'
})
export class AnimalsComponent implements OnInit {
  animalForm: FormGroup;
  userName: string = '';
  animalCount: string = '0 animales';
  nextAnimalId: number = 581;
  showNotifications: boolean = false;
  imageUrl: string = '';
  showImagePreview: boolean = false;
  
  animalSpecies: {value: string, label: string}[] = [
    { value: 'Vaca', label: 'ANIMALS.SPECIES_COW' },
    { value: 'Toro', label: 'ANIMALS.SPECIES_BULL' },
    { value: 'Oveja', label: 'ANIMALS.SPECIES_SHEEP' },
    { value: 'Cordero', label: 'ANIMALS.SPECIES_LAMB' },
    { value: 'Caballo', label: 'ANIMALS.SPECIES_HORSE' },
    { value: 'Yegua', label: 'ANIMALS.SPECIES_MARE' },
    { value: 'Cabra', label: 'ANIMALS.SPECIES_GOAT' },
    { value: 'Cerdo', label: 'ANIMALS.SPECIES_PIG' },
    { value: 'Gallina', label: 'ANIMALS.SPECIES_CHICKEN' },
    { value: 'Gallo', label: 'ANIMALS.SPECIES_ROOSTER' },
    { value: 'Conejo', label: 'ANIMALS.SPECIES_RABBIT' }
  ];
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private translate: TranslateService,
    private authService: AuthService,
    private animalService: AnimalService
  ) {
    this.animalForm = this.fb.group({
      nombre: ['', Validators.required],
      especie: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      sexo: ['', Validators.required],
      enfermedad: [''],
      estadoReproductivo: [''],
      imageUrl: [''],
      vacunasAplicadas: [''],
      numeroPartos: ['0'],
      ubicacion: [''],
      observaciones: ['']
    });
  }

  ngOnInit(): void {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
      this.translate.use(savedLang);
    }

    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.name;
    }
    
    this.animalService.getNextAnimalId().subscribe(id => {
      this.nextAnimalId = id;
    });
  }

  toggleNotifications(): void {  
    this.showNotifications = !this.showNotifications;
  }
  
  setImageUrl(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.imageUrl = input.value;
    this.animalForm.patchValue({ imageUrl: this.imageUrl });
    this.showImagePreview = this.imageUrl.trim() !== '';
  }
  
  clearImageUrl(): void {
    this.imageUrl = '';
    this.animalForm.patchValue({ imageUrl: '' });
    this.showImagePreview = false;
  }

  addAnimal(): void {
    if (this.animalForm.invalid) {
      Object.keys(this.animalForm.controls).forEach(key => {
        const control = this.animalForm.get(key);
        control?.markAsTouched();
      });
      return;
    }
    
    const user = this.authService.getCurrentUser();
    const userId = user ? user.id : undefined;
    
    const animalData: Animal = {
      ...this.animalForm.value,
      id: this.nextAnimalId,
      imagen: this.imageUrl || 'assets/images/default-animal.jpg',
      createdBy: userId
    };
    
    this.animalService.addAnimal(animalData).subscribe({
      next: (response: Animal) => {
        console.log('Animal added successfully:', response);
        this.router.navigate(['/dashboard']);
      },
      error: (error: any) => {
        console.error('Error adding animal:', error);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.authService.logout();
  }
}
