import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FooterComponentComponent } from '../../../public/components/footer-component/footer-component.component';
import { LanguageSwitcherComponent } from '../../../public/components/language-switcher/language-switcher.component';
import { AuthService } from '../../../public/services/auth.service';
import { HeaderComponent } from '../../../public/components/header-component/header-component.component';
import { AnimalService, Animal } from '../../services/animal.service';
import { MedicalHistoryService } from '../../services/medical-history.service';
import { EconomicService } from '../../services/economic.service';
import { Subscription, forkJoin } from 'rxjs';

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
    HeaderComponent
  ],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit, OnDestroy {
  userName: string = '';
  animalCount: string = '0 animales';
  showNotifications: boolean = false;
  searchTerm: string = '';
  showFilters: boolean = false;
  
  reportCards: ReportCard[] = [];
  
  animals: Animal[] = [];
  medicalEvents: any[] = [];
  incomes: any[] = [];
  expenses: any[] = [];
  
  private subscriptions: Subscription[] = [];
  
  constructor(
    private translate: TranslateService,
    private authService: AuthService,
    private animalService: AnimalService,
    private medicalHistoryService: MedicalHistoryService,
    private economicService: EconomicService
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
    this.loadData();
  }
  
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  
  loadData(): void {
    const animalsSub = this.animalService.getAnimalsByUser().subscribe(animals => {
      this.animals = animals;
      this.animalCount = `${animals.length} ${animals.length === 1 ? 'animal' : 'animales'}`;
      this.updateHealthReport();
      this.updateProductionReport();
    });
    
    const medicalEventsSub = this.loadAllMedicalEvents();
    
    const financialSub = forkJoin({
      incomes: this.economicService.getIncomes(),
      expenses: this.economicService.getExpenses()
    }).subscribe(({ incomes, expenses }) => {
      this.incomes = incomes;
      this.expenses = expenses;
      this.updateFinancialReport();
    });
    
    this.subscriptions.push(animalsSub, medicalEventsSub, financialSub);
  }
  
  loadAllMedicalEvents(): Subscription {
    return this.animalService.getAnimalsByUser().subscribe(animals => {
      const medicalEventsPromises = animals.map(animal => 
        this.medicalHistoryService.getMedicalEvents(animal.id)
      );
      
      forkJoin(medicalEventsPromises).subscribe(eventsArrays => {
        this.medicalEvents = eventsArrays.flat();
        this.updateHealthReport();
      });
    });
  }
  
  initializeReportCards(): void {
    this.reportCards = [
      {
        id: 'health',
        title: 'REPORTS.HEALTH_REPORT',
        icon: '🩺',
        statValue: 0,
        statLabel: 'REPORTS.HEALTHY_ANIMALS',
        searchPlaceholder: 'REPORTS.SEARCH_ANIMAL',
        color: '#A3C4A8', 
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
        statValue: 0,
        statLabel: 'REPORTS.PRODUCTION_EFFICIENCY',
        searchPlaceholder: 'REPORTS.SEARCH_ANIMAL',
        color: '#D1BFA5', 
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
        statValue: 'S/0',
        statLabel: 'REPORTS.NET_PROFIT',
        searchPlaceholder: 'REPORTS.SEARCH_CATEGORY',
        color: '#A3794F', 
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
        statValue: 0,
        statLabel: 'REPORTS.INVENTORY_LEVEL',
        searchPlaceholder: 'REPORTS.SEARCH_ITEM',
        color: '#8E5928', 
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
      
      this.updateCardStatistics(cardId, filterId);
    }
  }
  
  updateCardStatistics(cardId: string, filterId: string): void {
    switch (cardId) {
      case 'health':
        this.updateHealthReport(filterId);
        break;
      case 'production':
        this.updateProductionReport(filterId);
        break;
      case 'financial':
        this.updateFinancialReport(filterId);
        break;
      case 'inventory':
        this.updateInventoryReport(filterId);
        break;
    }
  }
  
  updateHealthReport(filterId: string = 'all'): void {
    const card = this.reportCards.find(c => c.id === 'health');
    if (!card || this.animals.length === 0) return;
    
    let filteredAnimals = this.animals;
    if (filterId !== 'all') {
      const speciesMap: {[key: string]: string[]} = {
        'cows': ['Vaca', 'Toro'],
        'goats': ['Cabra'],
        'sheep': ['Oveja', 'Cordero']
      };
      
      const species = speciesMap[filterId] || [];
      filteredAnimals = this.animals.filter(animal => species.includes(animal.especie));
    }
    
    if (filteredAnimals.length === 0) {
      card.statValue = 0;
      return;
    }
    
    const healthyAnimals = filteredAnimals.filter(animal => animal.enfermedad === 'No' || !animal.enfermedad);
    const healthyPercentage = Math.round((healthyAnimals.length / filteredAnimals.length) * 100);
    
    card.statValue = healthyPercentage;
  }
  
  updateProductionReport(filterId: string = 'all'): void {
    const card = this.reportCards.find(c => c.id === 'production');
    if (!card || this.animals.length === 0) return;
    
    let filteredAnimals = this.animals;
    if (filterId !== 'all') {
      const speciesMap: {[key: string]: string[]} = {
        'cows': ['Vaca', 'Toro'],
        'goats': ['Cabra'],
        'sheep': ['Oveja', 'Cordero']
      };
      
      const species = speciesMap[filterId] || [];
      filteredAnimals = this.animals.filter(animal => species.includes(animal.especie));
    }
    
    if (filteredAnimals.length === 0) {
      card.statValue = 0;
      return;
    }
    
    const productiveAnimals = filteredAnimals.filter(animal => 
      animal.estadoReproductivo === 'Gestación' || 
      (animal.numeroPartos && animal.numeroPartos > 0)
    );
    
    if (productiveAnimals.length === 0) {
      const healthyAnimals = filteredAnimals.filter(animal => animal.enfermedad === 'No' || !animal.enfermedad);
      const healthyPercentage = Math.round((healthyAnimals.length / filteredAnimals.length) * 100);
      card.statValue = Math.min(healthyPercentage + 10, 100); 
      const productionEfficiency = Math.round((productiveAnimals.length / filteredAnimals.length) * 100);
      card.statValue = productionEfficiency;
    }
  }
  
  updateFinancialReport(filterId: string = 'current'): void {
    const card = this.reportCards.find(c => c.id === 'financial');
    if (!card) return;
    
    const now = new Date();
    let startDate: Date;
    
    switch (filterId) {
      case 'current':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'last':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        now.setDate(endOfLastMonth.getDate());
        break;
      case 'quarter':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }
    
    const filteredIncomes = this.incomes.filter(income => {
      const incomeDate = new Date(income.date);
      return incomeDate >= startDate && incomeDate <= now;
    });
    
    const filteredExpenses = this.expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startDate && expenseDate <= now;
    });
    
    const totalIncome = filteredIncomes.reduce((sum, income) => sum + parseFloat(income.amount), 0);
    const totalExpense = filteredExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    const netProfit = totalIncome - totalExpense;
    
    card.statValue = `S/${netProfit.toFixed(2)}`;
  }
  
  updateInventoryReport(filterId: string = 'all'): void {
    const card = this.reportCards.find(c => c.id === 'inventory');
    if (!card) return;
    
    let filteredExpenses = this.expenses;
    if (filterId !== 'all') {
      const categoryMap: {[key: string]: string[]} = {
        'feed': ['Alimentación'],
        'medicine': ['Veterinario', 'Suministros'],
        'equipment': ['Equipamiento', 'Mantenimiento']
      };
      
      const categories = categoryMap[filterId] || [];
      filteredExpenses = this.expenses.filter(expense => categories.includes(expense.category));
    }
    
    const recentExpenses = filteredExpenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return expenseDate >= threeMonthsAgo;
    });
    
    let inventoryLevel = 0;
    if (filteredExpenses.length > 0) {
      inventoryLevel = Math.round((recentExpenses.length / filteredExpenses.length) * 100);
      
     
      inventoryLevel = Math.min(inventoryLevel + 50, 100); 
    } else {
      inventoryLevel = 50;
    }
    
    card.statValue = inventoryLevel;
  }
  
  generateReport(): void {
    alert(this.translate.instant('REPORTS.REPORT_GENERATED'));
  }
  
  logout(): void {
    this.authService.logout();
  }
}