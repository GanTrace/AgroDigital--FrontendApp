import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FooterComponentComponent } from '../../../public/components/footer-component/footer-component.component';
import { LanguageSwitcherComponent } from '../../../public/components/language-switcher/language-switcher.component';
import { AuthService } from '../../../public/services/auth.service';
import { NotificationsComponent } from '../../../public/pages/notifications/notifications.component';
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
    NotificationsComponent,
    HeaderComponent
  ],
  templateUrl: './economic-control.component.html',
  styleUrls: ['./economic-control.component.css']
})
export class EconomicControlComponent implements OnInit, OnDestroy {
  public ingresos: number = 0;
  public gastos: number = 0;
  userName: string = '';
  animalCount: string = '0 animales';
  showNotifications: boolean = false;
  private incomeSubscription?: Subscription;
  private expenseSubscription?: Subscription;

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
    
    // Suscribirse a los cambios en ingresos y gastos
    this.incomeSubscription = this.economicService.getTotalIncome().subscribe(total => {
      this.ingresos = total;
    });
    
    this.expenseSubscription = this.economicService.getTotalExpense().subscribe(total => {
      this.gastos = total;
    });
    
    setTimeout(() => {
      this.createChart();
    }, 100);
  }

  ngOnDestroy() {
    // Cancelar suscripciones para evitar memory leaks
    if (this.incomeSubscription) {
      this.incomeSubscription.unsubscribe();
    }
    
    if (this.expenseSubscription) {
      this.expenseSubscription.unsubscribe();
    }
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

  createChart() {
    const ctx = document.getElementById('chart') as HTMLCanvasElement;
    if (!ctx) return;

    const labels = Array.from({ length: 50 }, (_, i) => `Sem ${i+1}`);
    const data = Array.from({ length: 50 }, () => Math.floor(Math.random() * 2000) + 500);
    
    data[0] = 3200;
    data[1] = 2800;
    data[2] = 2600;
    data[3] = 2500;
    data[4] = 2400;
    
    for (let i = 5; i < data.length; i++) {
      data[i] = Math.max(500, data[i-1] - Math.floor(Math.random() * 200));
    }

    const chart = new Chart(ctx, {
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
              maxRotation: 90,
              minRotation: 90
            }
          }
        }
      }
    });
  }
}
