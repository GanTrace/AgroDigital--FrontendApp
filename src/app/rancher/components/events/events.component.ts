import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FooterComponentComponent } from '../../../public/components/footer-component/footer-component.component';
import { LanguageSwitcherComponent } from '../../../public/components/language-switcher/language-switcher.component';
import { AuthService } from '../../../public/services/auth.service';
import { NotificationsComponent } from '../../../public/pages/notifications/notifications.component';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    TranslateModule,
    FooterComponentComponent,
    LanguageSwitcherComponent,
    NotificationsComponent
  ],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  userName: string = '';
  animalCount: string = '580 animales';
  showNotifications: boolean = false;
  
  events = [
    {
      tipo: 'Vacunas',
      titulo: 'Vacunación Municipal',
      fecha: '28 de abril del 2024',
      descripcion: 'Lorem ipsum vitae ullamcorper gravida aliquam laoreet elementum donec vestibulum dictumst tortor',
      imagen: '/assets/img/vacunacion1.jpg'
    },
    {
      tipo: 'Vacunas',
      titulo: 'Vacunación Municipal',
      fecha: '28 de abril del 2024',
      descripcion: 'Lorem ipsum vitae ullamcorper gravida aliquam laoreet elementum donec vestibulum dictumst tortor',
      imagen: '/assets/img/vacunacion2.jpg'
    },
    {
      tipo: 'Visita',
      titulo: 'Visita Municipal',
      fecha: '28 de abril del 2024',
      descripcion: 'Lorem ipsum vitae ullamcorper gravida aliquam laoreet elementum donec vestibulum dictumst tortor',
      imagen: '/assets/img/visita1.jpg'
    },
    {
      tipo: 'Visita',
      titulo: 'Micro Exportadores',
      fecha: '28 de abril del 2024',
      descripcion: 'Lorem ipsum vitae ullamcorper gravida aliquam laoreet elementum donec vestibulum dictumst tortor',
      imagen: '/assets/img/visita2.jpg'
    }
  ];

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
  
  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }
  
  logout(): void {
    this.authService.logout();
  }
}
