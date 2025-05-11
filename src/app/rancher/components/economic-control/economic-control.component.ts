import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { FooterComponentComponent } from '../../../public/components/footer-component/footer-component.component';

Chart.register(...registerables);

@Component({
  selector: 'app-economic-control',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponentComponent],
  templateUrl: './economic-control.component.html',
  styleUrls: ['./economic-control.component.css']
})
export class EconomicControlComponent implements OnInit {
  public ingresos: number = 1485;
  public gastos: number = 1485;

  ngOnInit() {
    setTimeout(() => {
      this.createChart();
    }, 100);
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
          label: 'Leads generados por semana',
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
