import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FooterComponentComponent } from '../../../public/components/footer-component/footer-component.component';
import { LanguageSwitcherComponent } from '../../../public/components/language-switcher/language-switcher.component';
import { AuthService } from '../../../public/services/auth.service';
import { HeaderComponent } from '../../../public/components/header-component/header-component.component';
import { EconomicService } from '../../services/economic.service';
import { Subscription } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-economic-control',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    TranslateModule,
    FooterComponentComponent,
    LanguageSwitcherComponent,
    HeaderComponent
  ],
  templateUrl: './economic-control.component.html',
  styleUrls: ['./economic-control.component.css']
})
export class EconomicControlComponent implements OnInit, OnDestroy {
  public ingresos: number = 0;
  public gastos: number = 0;
  public balance: number = 0; 
  userName: string = '';
  animalCount: string = '0 animales';
  showNotifications: boolean = false;
  recentTransactions: any[] = []; 
  private incomeSubscription?: Subscription;
  private expenseSubscription?: Subscription;
  private transactionsSubscription?: Subscription; 
  private chart: Chart | null = null;
  private isChartInitialized = false;

  constructor(
    private translate: TranslateService,
    private authService: AuthService,
    private economicService: EconomicService,
    private router: Router
  ) {}

  ngOnInit() {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
      this.translate.use(savedLang);
    }
    
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.name;
    }
    
    this.loadFinancialData();
    this.loadRecentTransactions(); 
    
    setTimeout(() => {
      this.initializeChart();
    }, 300);
  }

  ngOnDestroy() {
    if (this.incomeSubscription) {
      this.incomeSubscription.unsubscribe();
    }
    
    if (this.expenseSubscription) {
      this.expenseSubscription.unsubscribe();
    }
    
    if (this.transactionsSubscription) { 
      this.transactionsSubscription.unsubscribe();
    }
    
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }
  
  loadRecentTransactions() {
    this.transactionsSubscription = this.economicService.getRecentTransactions().subscribe(
      transactions => {
        this.recentTransactions = transactions;
      },
      error => {
        console.error('Error loading transactions', error);
        this.recentTransactions = [];
      }
    );
  }
  
  getTransactionIcon(category: string): string {
    const icons: {[key: string]: string} = {
      'sales': '💰',
      'investment': '📈',
      'investments': '📈',
      'services': '🛠️',
      'other': '💵',
      'feed': '🌾',
      'veterinary': '💉',
      'equipment': '🔧',
      'maintenance': '🏗️',
      'supplies': '📦',
      'other_expense': '💸'
    };
    
    return icons[category.toLowerCase()] || '📋';
  }
  
  getTranslatedCategory(category: string): string {
    const categoryKey = category.toUpperCase().replace(/\s+/g, '_');
    if (category.toLowerCase().includes('expense')) {
      return this.translate.instant(`ECONOMIC_CONTROL.EXPENSE_CATEGORIES.${categoryKey}`);
    } else {
      return this.translate.instant(`ECONOMIC_CONTROL.CATEGORIES.${categoryKey}`);
    }
  }
  
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString(this.translate.currentLang === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat(this.translate.currentLang === 'es' ? 'es-ES' : 'en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
  
  loadFinancialData() {
    this.incomeSubscription = this.economicService.getTotalIncome().subscribe(total => {
      this.ingresos = total;
      this.calculateBalance(); 
    });
    
    this.expenseSubscription = this.economicService.getTotalExpense().subscribe(total => {
      this.gastos = total;
      this.calculateBalance(); 
    });
  }
  
  calculateBalance() {
    this.balance = this.ingresos - this.gastos;
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  logout(): void {
    this.authService.logout();
  }

  navigateToAddIncome(): void {
    this.router.navigate(['/add-income']);
  }

  navigateToAddExpense(): void {
    this.router.navigate(['/add-expense']);
  }

  deleteTransaction(transaction: any): void {
    if (confirm(this.translate.instant('ECONOMIC_CONTROL.CONFIRM_DELETE_MESSAGE'))) {
      this.economicService.deleteTransaction(transaction.id, transaction.type).subscribe({
        next: () => {
          alert(this.translate.instant('ECONOMIC_CONTROL.TRANSACTION_DELETED'));
          this.loadRecentTransactions();
          this.loadFinancialData();
        },
        error: (error) => {
          console.error('Error deleting transaction', error);
          alert(this.translate.instant('ECONOMIC_CONTROL.ERROR_DELETING'));
        }
      });
    }
  }

  initializeChart() {
    if (this.isChartInitialized) return;
    
    const ctx = document.getElementById('chart') as HTMLCanvasElement;
    if (!ctx) return;
    
    this.isChartInitialized = true;
    
    const dataPoints = 12; 
    const labels = Array.from({ length: dataPoints }, (_, i) => `Sem ${i+1}`);
    
    const data = Array.from({ length: dataPoints }, (_, i) => {
      if (i < 5) {
        return 3200 - (i * 200); 
      } else {
        return Math.max(500, 2400 - ((i-4) * 150));
      }
    });

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: this.translate.instant('ECONOMIC_CONTROL.LEADS'),
          data: data,
          backgroundColor: '#2563EB',
          borderColor: '#2563EB',
          borderWidth: 1,
          barPercentage: 0.8,
          categoryPercentage: 0.9
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 500 
        },
        plugins: {
          legend: {
            position: 'top',
            align: 'start',
            labels: {
              boxWidth: 10,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: $${context.parsed.y}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: true
            },
            ticks: {
              font: {
                size: 12
              }
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                size: 10
              },
              maxRotation: 45, 
              minRotation: 45
            }
          }
        }
      }
    });
  }
}
