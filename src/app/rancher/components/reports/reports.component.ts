import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponentComponent } from '../../../public/components/footer-component/footer-component.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponentComponent],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {
  // Aquí puedes agregar la lógica para manejar los filtros y estadísticas
  // Por ejemplo, métodos para cambiar los filtros seleccionados o actualizar los valores
}
