import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FooterComponentComponent } from '../../../public/components/footer-component/footer-component.component';
import { LanguageSwitcherComponent } from '../../../public/components/language-switcher/language-switcher.component';
import { AuthService } from '../../../public/services/auth.service';
import { NotificationsComponent } from '../../../public/pages/notifications/notifications.component';
import { HeaderComponent } from '../../../public/components/header-component/header-component.component';

interface ReportFilter {
  id: string;
  name: string;
  selected: boolean;
}

interface ReportCard {
  id: string;
  title: string;
  icon: string;
  statValue: string | number;
  statLabel: string;
  searchPlaceholder: string;
  filters: ReportFilter[];
  color: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    TranslateModule,
    FormsModule,
    FooterComponentComponent,
    LanguageSwitcherComponent,
    NotificationsComponent,
    HeaderComponent
  ],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  userName: string = '';
  animalCount: string = '580 animales';
  showNotifications: boolean = false;
  searchTerm: string = '';
  showFilters: boolean = false;
  
  reportCards: ReportCard[] = [];
  
  constructor(
    private translate: TranslateService,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
      this.translate.use(savedLang);
    }
    
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.name;
    }
    
    this.initializeReportCards();
  }
  
  initializeReportCards(): void {
    this.reportCards = [
      {
        id: 'health',
        title: 'REPORTS.HEALTH_REPORT',
        icon: '🩺',
        statValue: 85,
        statLabel: 'REPORTS.HEALTHY_ANIMALS',
        searchPlaceholder: 'REPORTS.SEARCH_ANIMAL',
        color: '#A3C4A8', // Green
        filters: [
          { id: 'all', name: 'REPORTS.ALL_ANIMALS', selected: true },
          { id: 'cows', name: 'REPORTS.COWS', selected: false },
          { id: 'goats', name: 'REPORTS.GOATS', selected: false },
          { id: 'sheep', name: 'REPORTS.SHEEP', selected: false }
        ]
      },
      {
        id: 'production',
        title: 'REPORTS.PRODUCTION_REPORT',
        icon: '📈',
        statValue: 92,
        statLabel: 'REPORTS.PRODUCTION_EFFICIENCY',
        searchPlaceholder: 'REPORTS.SEARCH_ANIMAL',
        color: '#D1BFA5', // Beige
        filters: [
          { id: 'all', name: 'REPORTS.ALL_ANIMALS', selected: true },
          { id: 'cows', name: 'REPORTS.COWS', selected: false },
          { id: 'goats', name: 'REPORTS.GOATS', selected: false },
          { id: 'sheep', name: 'REPORTS.SHEEP', selected: false }
        ]
      },
      {
        id: 'financial',
        title: 'REPORTS.FINANCIAL_REPORT',
        icon: '💰',
        statValue: 'S/2850',
        statLabel: 'REPORTS.NET_PROFIT',
        searchPlaceholder: 'REPORTS.SEARCH_CATEGORY',
        color: '#A3794F', // Brown
        filters: [
          { id: 'current', name: 'REPORTS.CURRENT_MONTH', selected: true },
          { id: 'last', name: 'REPORTS.LAST_MONTH', selected: false },
          { id: 'quarter', name: 'REPORTS.LAST_QUARTER', selected: false },
          { id: 'year', name: 'REPORTS.LAST_YEAR', selected: false }
        ]
      },
      {
        id: 'inventory',
        title: 'REPORTS.INVENTORY_REPORT',
        icon: '📦',
        statValue: 78,
        statLabel: 'REPORTS.INVENTORY_LEVEL',
        searchPlaceholder: 'REPORTS.SEARCH_ITEM',
        color: '#8E5928', // Dark brown
        filters: [
          { id: 'all', name: 'REPORTS.ALL_ITEMS', selected: true },
          { id: 'feed', name: 'REPORTS.FEED', selected: false },
          { id: 'medicine', name: 'REPORTS.MEDICINE', selected: false },
          { id: 'equipment', name: 'REPORTS.EQUIPMENT', selected: false }
        ]
      }
    ];
  }
  
  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }
  
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }
  
  selectFilter(cardId: string, filterId: string): void {
    const card = this.reportCards.find(c => c.id === cardId);
    if (card) {
      card.filters.forEach(filter => {
        filter.selected = filter.id === filterId;
      });
      
      // In a real app, you would fetch new data based on the selected filter
      this.updateCardStatistics(cardId, filterId);
    }
  }
  
  updateCardStatistics(cardId: string, filterId: string): void {
    // Mock data updates based on filter selection
    const card = this.reportCards.find(c => c.id === cardId);
    if (card) {
      switch (cardId) {
        case 'health':
          if (filterId === 'all') card.statValue = 85;
          else if (filterId === 'cows') card.statValue = 90;
          else if (filterId === 'goats') card.statValue = 82;
          else if (filterId === 'sheep') card.statValue = 78;
          break;
        case 'production':
          if (filterId === 'all') card.statValue = 92;
          else if (filterId === 'cows') card.statValue = 95;
          else if (filterId === 'goats') card.statValue = 88;
          else if (filterId === 'sheep') card.statValue = 84;
          break;
        case 'financial':
          if (filterId === 'current') card.statValue = 'S/2850';
          else if (filterId === 'last') card.statValue = 'S/2450';
          else if (filterId === 'quarter') card.statValue = 'S/7200';
          else if (filterId === 'year') card.statValue = 'S/32500';
          break;
        case 'inventory':
          if (filterId === 'all') card.statValue = 78;
          else if (filterId === 'feed') card.statValue = 65;
          else if (filterId === 'medicine') card.statValue = 85;
          else if (filterId === 'equipment') card.statValue = 92;
          break;
      }
    }
  }
  
  generateReport(): void {
    // In a real app, this would generate a PDF or Excel report
    alert(this.translate.instant('REPORTS.REPORT_GENERATED'));
  }
  
  logout(): void {
    this.authService.logout();
  }
}
