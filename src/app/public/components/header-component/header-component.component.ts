import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
  user: User | null = null;
  animalCount: string = '0 animales';
  showNotifications: boolean = false;

  constructor(
    private authService: AuthService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  logout(): void {
    this.authService.logout();
  }
}