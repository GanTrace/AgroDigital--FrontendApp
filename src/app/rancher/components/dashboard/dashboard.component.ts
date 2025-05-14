import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FooterComponentComponent } from '../../../public/components/footer-component/footer-component.component';
import { LanguageSwitcherComponent } from '../../../public/components/language-switcher/language-switcher.component';
import { AuthService } from '../../../public/services/auth.service';
import { NotificationsComponent } from '../../../public/pages/notifications/notifications.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    FooterComponentComponent,
    LanguageSwitcherComponent,
    NotificationsComponent,
    FormsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  showNotifications: boolean = false;
  showFilters: boolean = false;
  
  // Opciones de filtro
  animalTypes = ['Vaca', 'Toro', 'Oveja', 'Cordero', 'Cerdo', 'Caballo'];
  ageRange = { min: 0, max: 30, value: 30 };
  genders = ['Macho', 'Hembra'];
  diseaseOptions = ['Sí', 'No'];
  
  selectedFilters = {
    type: 'Vaca',
    age: 30,
    gender: 'Macho',
    disease: 'No'
  };
  
  allAnimals = [
    {
      nombre: 'Rascas',
      especie: 'Vaca',
      edad: '5 años',
      sexo: 'Macho',
      enfermedades: 'No',
      imagen: '/assets/img/vaca.jpg'
    },
    {
      nombre: 'Luna',
      especie: 'Vaca',
      edad: '3 años',
      sexo: 'Hembra',
      enfermedades: 'No',
      imagen: '/assets/img/vaca.jpg'
    },
    {
      nombre: 'Tormenta',
      especie: 'Toro',
      edad: '7 años',
      sexo: 'Macho',
      enfermedades: 'No',
      imagen: '/assets/img/toro.jpg'
    },
    {
      nombre: 'Manchas',
      especie: 'Vaca',
      edad: '4 años',
      sexo: 'Hembra',
      enfermedades: 'Sí',
      imagen: '/assets/img/vaca.jpg'
    },
    {
      nombre: 'Nube',
      especie: 'Oveja',
      edad: '2 años',
      sexo: 'Hembra',
      enfermedades: 'No',
      imagen: '/assets/img/oveja.jpg'
    },
    {
      nombre: 'Lana',
      especie: 'Oveja',
      edad: '3 años',
      sexo: 'Hembra',
      enfermedades: 'No',
      imagen: '/assets/img/oveja.jpg'
    },
    {
      nombre: 'Trueno',
      especie: 'Caballo',
      edad: '8 años',
      sexo: 'Macho',
      enfermedades: 'No',
      imagen: '/assets/img/caballo.jpg'
    },
    {
      nombre: 'Pegaso',
      especie: 'Caballo',
      edad: '6 años',
      sexo: 'Macho',
      enfermedades: 'Sí',
      imagen: '/assets/img/caballo.jpg'
    },
    {
      nombre: 'Rosita',
      especie: 'Cerdo',
      edad: '1 año',
      sexo: 'Hembra',
      enfermedades: 'No',
      imagen: '/assets/img/cerdo.jpg'
    },
    {
      nombre: 'Orejón',
      especie: 'Cerdo',
      edad: '2 años',
      sexo: 'Macho',
      enfermedades: 'No',
      imagen: '/assets/img/cerdo.jpg'
    },
    {
      nombre: 'Lana Blanca',
      especie: 'Cordero',
      edad: '1 año',
      sexo: 'Hembra',
      enfermedades: 'No',
      imagen: '/assets/img/cordero.jpg'
    },
    {
      nombre: 'Copito',
      especie: 'Cordero',
      edad: '1 año',
      sexo: 'Macho',
      enfermedades: 'Sí',
      imagen: '/assets/img/cordero.jpg'
    }
  ];
  filteredAnimals = [...this.allAnimals];
  animals = this.filteredAnimals.slice(0, 4);
  
  showingAllAnimals: boolean = false;
  
  userName = '';
  animalCount = '0 animales';

  constructor(
    private translate: TranslateService,
    private authService: AuthService,
    private router: Router
  ) {}

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  applyFilters(): void {
    this.filteredAnimals = this.allAnimals.filter(animal => {
      if (this.selectedFilters.type !== '' && animal.especie !== this.selectedFilters.type) {
        return false;
      }
      
      const animalAge = parseInt(animal.edad);
      if (!isNaN(animalAge) && animalAge > this.selectedFilters.age) {
        return false;
      }
      
      if (this.selectedFilters.gender !== '' && animal.sexo !== this.selectedFilters.gender) {
        return false;
      }
      
      if (this.selectedFilters.disease !== '' && animal.enfermedades !== this.selectedFilters.disease) {
        return false;
      }
      
      return true;
    });
    
    if (this.showingAllAnimals) {
      this.animals = this.filteredAnimals;
    } else {
      this.animals = this.filteredAnimals.slice(0, 4);
    }
    
    this.showFilters = false;
  }

  resetFilters(): void {
    this.selectedFilters = {
      type: 'Vaca',
      age: 30,
      gender: 'Macho',
      disease: 'No'
    };
    
    this.filteredAnimals = [...this.allAnimals];
    
    if (this.showingAllAnimals) {
      this.animals = this.filteredAnimals;
    } else {
      this.animals = this.filteredAnimals.slice(0, 4);
    }
  }
  
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
  }
  
  logout(): void {
    this.authService.logout();
  }
  
  toggleViewMore(): void {
    if (this.showingAllAnimals) {
      this.animals = this.filteredAnimals.slice(0, 4);
      this.showingAllAnimals = false;
    } else {
      this.animals = this.filteredAnimals;
      this.showingAllAnimals = true;
    }
  }
}
