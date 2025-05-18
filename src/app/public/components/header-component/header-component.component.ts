import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService, User } from '../../../public/services/auth.service';
import { LanguageSwitcherComponent } from '../../../public/components/language-switcher/language-switcher.component';
import { NotificationsComponent } from '../../../public/pages/notifications/notifications.component';

@Component({
  selector: 'app-header-component',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    LanguageSwitcherComponent,
    NotificationsComponent
  ],
  templateUrl: './header-component.component.html',
  styleUrls: ['./header-component.component.css']
})
export class HeaderComponent implements OnInit {
  userName = '';
  userRole = '';
  profileImage = '';
  itemCount = '0';
  showNotifications = false;
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.name;
      this.userRole = user.role || 'rancher';
      this.profileImage = user.profileImage || 'assets/images/default-avatar.png';
      
      if (this.userRole === 'rancher') {
        this.itemCount = '0 animales';
      } else if (this.userRole === 'veterinarian') {
        this.itemCount = '0 pacientes';
      }
    }
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  logout(): void {
    this.authService.logout();
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  getNavLinks(): {path: string, label: string}[] {
    if (this.userRole === 'veterinarian') {
      return [
        { path: '/veterinarian/dashboard', label: 'HEADER.DASHBOARD' },
        { path: '/appointments', label: 'HEADER.APPOINTMENTS' },
        { path: '/patients', label: 'HEADER.PATIENTS' },
        { path: '/medical-records', label: 'HEADER.MEDICAL_RECORDS' },
        { path: '/settings', label: 'HEADER.SETTINGS' }
      ];
    } else {
      return [
        { path: '/dashboard', label: 'HEADER.DASHBOARD' },
        { path: '/animals', label: 'HEADER.ANIMALS' },
        { path: '/events', label: 'HEADER.EVENTS' },
        { path: '/medical-history', label: 'HEADER.MEDICAL_HISTORY' },
        { path: '/economic-control', label: 'HEADER.ECONOMIC_CONTROL' },
        { path: '/reports', label: 'HEADER.REPORTS' },
        { path: '/settings', label: 'HEADER.SETTINGS' }
      ];
    }
  }
}