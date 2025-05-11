import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent {
  events = [
    {
      tipo: 'Vacunas',
      titulo: 'Vacunación Municipal',
      fecha: '28 de abril del 2024',
      descripcion: 'Lorem ipsum vitae ullamcorper gravida aliquam laoreet elementum donec vestibulum dictumst tortor',
      imagen: '/assets/img/vacunacion1.jpg'
    },
    {
      tipo: 'Vacunas',
      titulo: 'Vacunación Municipal',
      fecha: '28 de abril del 2024',
      descripcion: 'Lorem ipsum vitae ullamcorper gravida aliquam laoreet elementum donec vestibulum dictumst tortor',
      imagen: '/assets/img/vacunacion2.jpg'
    },
    {
      tipo: 'Visita',
      titulo: 'Visita Municipal',
      fecha: '28 de abril del 2024',
      descripcion: 'Lorem ipsum vitae ullamcorper gravida aliquam laoreet elementum donec vestibulum dictumst tortor',
      imagen: '/assets/img/visita1.jpg'
    },
    {
      tipo: 'Visita',
      titulo: 'Micro Exportadores',
      fecha: '28 de abril del 2024',
      descripcion: 'Lorem ipsum vitae ullamcorper gravida aliquam laoreet elementum donec vestibulum dictumst tortor',
      imagen: '/assets/img/visita2.jpg'
    }
  ];
}
