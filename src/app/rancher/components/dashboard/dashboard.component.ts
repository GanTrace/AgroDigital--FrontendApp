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
  ageRange = { min: 0, max: 15, value: 15 };
  genders = ['Macho', 'Hembra'];
  diseaseOptions = ['Sí', 'No'];
  
  // Filtros seleccionados
  selectedFilters = {
    type: 'Vaca',
    age: 15,
    gender: 'Macho',
    disease: 'No'
  };
  
  allAnimals = Array(12).fill({
    nombre: 'Rascas',
    especie: 'Vaca',
    edad: '5 años',
    sexo: 'Macho',
    enfermedades: 'No',
    imagen: '/assets/img/vaca.jpg'
  });
  
  animals = this.allAnimals.slice(0, 4);
  
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
    // Aquí implementaríamos la lógica real de filtrado
    // Por ahora, solo cerramos el panel de filtros
    this.showFilters = false;
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
  
  // Método para alternar entre ver más y ver menos
  toggleViewMore(): void {
    if (this.showingAllAnimals) {
      // Si ya estamos mostrando todos, volvemos a mostrar solo 4
      this.animals = this.allAnimals.slice(0, 4);
      this.showingAllAnimals = false;
    } else {
      // Si no, mostramos todos los animales
      this.animals = this.allAnimals;
      this.showingAllAnimals = true;
    }
  }
}
