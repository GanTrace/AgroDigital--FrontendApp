import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FooterComponentComponent } from '../../../public/components/footer-component/footer-component.component';
import { LanguageSwitcherComponent } from '../../../public/components/language-switcher/language-switcher.component';
import { AuthService } from '../../../public/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    TranslateModule,
    FooterComponentComponent,
    LanguageSwitcherComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  animals = Array(4).fill({
    nombre: 'Rascas',
    especie: 'Vaca',
    edad: '5 años',
    sexo: 'Macho',
    enfermedades: 'No',
    imagen: '/assets/img/vaca.jpg'
  });
  
  userName = '';
  animalCount = '0 animales';

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
      this.animalCount = '580 animales'; // This would come from a real API in a production app
    }
  }
  
  logout(): void {
    this.authService.logout();
  }
}
