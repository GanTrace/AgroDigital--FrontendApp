import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-economic-control',
  standalone: true,
  imports: [],
  templateUrl: './economic-control.component.html',
  styleUrls: ['./economic-control.component.css']
})
export class EconomicControlComponent implements OnInit {
  public ingresos: number = 1485;
  public gastos: number = 1485;

  ngOnInit() {
    this.createChart();
  }

  createChart() {
    const ctx = document.getElementById('chart') as HTMLCanvasElement;
    const chart = new Chart(ctx, {
      type: 'line', 
      data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May'],
        datasets: [{
          label: 'Ingresos',
          data: [1200, 1500, 1700, 1800, 2000],
          fill: false,
          borderColor: '#79b267',
          tension: 0.1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
