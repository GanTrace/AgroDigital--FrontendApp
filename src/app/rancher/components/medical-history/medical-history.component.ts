import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FooterComponentComponent } from '../../../public/components/footer-component/footer-component.component';
import { LanguageSwitcherComponent } from '../../../public/components/language-switcher/language-switcher.component';
import { AuthService } from '../../../public/services/auth.service';
import { NotificationsComponent } from '../../../public/pages/notifications/notifications.component';

interface Animal {
  id: number;
  nombre: string;
  tipo: string;
  fechaNacimiento: string;
  edad: string;
  sexo: string;
  problemasSalud: string;
  zona: string;
  alimentacion: string;
  peso: string;
  crias: string;
  partos: string;
  estado: string;
  imagen: string;
}

interface MedicalRecord {
  id: number;
  fecha: string;
  tipoEvento: string;
  descripcion: string;
  veterinario: string;
  observaciones: string;
  adjuntos: string[];
}

@Component({
  selector: 'app-medical-history',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    FooterComponentComponent,
    LanguageSwitcherComponent,
    NotificationsComponent
  ],
  templateUrl: './medical-history.component.html',
  styleUrls: ['./medical-history.component.css']
})
export class MedicalHistoryComponent implements OnInit {
  userName = '';
  animalCount = '0 animales';
  showNotifications: boolean = false;
  
  selectedAnimal: Animal = {
    id: 49,
    nombre: 'Clery',
    tipo: 'Vaca Holstein',
    fechaNacimiento: '15/05/2019',
    edad: '4 años',
    sexo: 'Hembra',
    problemasSalud: 'Ninguno',
    zona: 'Sector Norte',
    alimentacion: 'Pasto y concentrado',
    peso: '580 kg',
    crias: '2',
    partos: '2',
    estado: 'Activo',
    imagen: 'Vaca3.jpg'
  };
  
  medicalRecords: MedicalRecord[] = [
    {
      id: 1,
      fecha: '15/10/2023',
      tipoEvento: 'Vacunación',
      descripcion: 'Vacuna contra la fiebre aftosa',
      veterinario: 'Dr. García',
      observaciones: 'Sin reacciones adversas',
      adjuntos: ['Certificado.pdf', 'Factura.pdf']
    },
    {
      id: 2,
      fecha: '20/09/2023',
      tipoEvento: 'Revisión',
      descripcion: 'Revisión general de salud',
      veterinario: 'Dra. Martínez',
      observaciones: 'Estado óptimo',
      adjuntos: ['Informe.pdf']
    },
    {
      id: 3,
      fecha: '05/11/2023',
      tipoEvento: 'Tratamiento',
      descripcion: 'Tratamiento para parásitos externos',
      veterinario: 'Dr. García',
      observaciones: 'Seguimiento en 15 días',
      adjuntos: []
    }
  ];

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
      this.animalCount = '0 animales';
    }
  }
  
  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }
  
  logout(): void {
    this.authService.logout();
  }
}
