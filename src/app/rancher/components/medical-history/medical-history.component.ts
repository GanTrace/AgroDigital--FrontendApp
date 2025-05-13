import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FooterComponentComponent } from '../../../public/components/footer-component/footer-component.component';
import { LanguageSwitcherComponent } from '../../../public/components/language-switcher/language-switcher.component';
import { AuthService } from '../../../public/services/auth.service';

@Component({
  selector: 'app-medical-history',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    TranslateModule,
    FooterComponentComponent,
    LanguageSwitcherComponent
  ],
  templateUrl: './medical-history.component.html',
  styleUrls: ['./medical-history.component.css']
})
export class MedicalHistoryComponent implements OnInit {
  selectedAnimal = {
    id: 58,
    nombre: 'CARLY',
    tipo: 'Cabra Lechera',
    fechaNacimiento: '19/04/2022',
    edad: '3 años',
    sexo: 'Hembra',
    problemasSalud: 'No',
    zona: 'B',
    alimentacion: 'Heno y Frutas',
    peso: '40.39 kg',
    crias: '3',
    partos: '1',
    estado: 'Vivo',
    imagen: '/assets/img/cabra.jpg'
  };

  medicalRecords = [
    {
      fecha: '15/04/2025',
      tipoEvento: 'Vacunación',
      descripcion: 'Sin riesgos',
      veterinario: 'Juan De la Rosa',
      observaciones: 'Sin obs.',
      adjuntos: '-'
    },
    {
      fecha: '10/04/2025',
      tipoEvento: 'Revisión',
      descripcion: 'Sin riesgos',
      veterinario: 'Juan De la Rosa',
      observaciones: 'Sin obs.',
      adjuntos: 'Pdf'
    },
    {
      fecha: '5/04/2025',
      tipoEvento: 'Esterilización',
      descripcion: 'Sin riesgos',
      veterinario: 'Juan De la Rosa',
      observaciones: 'Sin obs.',
      adjuntos: '-'
    },
    {
      fecha: '5/03/2025',
      tipoEvento: 'Control médico',
      descripcion: 'Sin riesgos',
      veterinario: 'Esteban Grados',
      observaciones: 'Se receta med...',
      adjuntos: 'Imagen'
    }
  ];

  userName: string = '';
  animalCount: string = '580 animales';
  
  constructor(
    private translate: TranslateService,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    // Set language from localStorage or default
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
      this.translate.use(savedLang);
    }
  
    // Get user data
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.name;
    }
  }
  
  logout(): void {
    this.authService.logout();
  }
}
