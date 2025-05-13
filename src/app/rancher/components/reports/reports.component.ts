import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FooterComponentComponent } from '../../../public/components/footer-component/footer-component.component';
import { LanguageSwitcherComponent } from '../../../public/components/language-switcher/language-switcher.component';
import { AuthService } from '../../../public/services/auth.service';
import { NotificationsComponent } from '../../../public/pages/notifications/notifications.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    TranslateModule,
    FooterComponentComponent,
    LanguageSwitcherComponent,
    NotificationsComponent
  ],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  userName: string = '';
  animalCount: string = '580 animales';
  showNotifications: boolean = false;
  
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
