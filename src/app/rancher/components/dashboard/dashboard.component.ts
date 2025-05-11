import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  animals = Array(4).fill({
    nombre: 'Rascas',
    especie: 'Vaca',
    edad: '5 años',
    sexo: 'Macho',
    enfermedades: 'No',
    imagen: '/assets/img/vaca.jpg'
  });
}
