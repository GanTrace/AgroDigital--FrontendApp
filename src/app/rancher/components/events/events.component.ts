import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule],
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
      imagen: 'https://images.unsplash.com/photo-1603201667143-653bb655ced5?auto=format&fit=crop&w=800&q=60'
    },
    {
      tipo: 'Vacunas',
      titulo: 'Vacunación Municipal',
      fecha: '28 de abril del 2024',
      descripcion: 'Lorem ipsum vitae ullamcorper gravida aliquam laoreet elementum donec vestibulum dictumst tortor',
      imagen: 'https://images.unsplash.com/photo-1603871892512-bb63886c1b3a?auto=format&fit=crop&w=800&q=60'
    },
    {
      tipo: 'Visita',
      titulo: 'Visita Municipal',
      fecha: '28 de abril del 2024',
      descripcion: 'Lorem ipsum vitae ullamcorper gravida aliquam laoreet elementum donec vestibulum dictumst tortor',
      imagen: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=800&q=60'
    },
    {
      tipo: 'Visita',
      titulo: 'Micro Exportadores',
      fecha: '28 de abril del 2024',
      descripcion: 'Lorem ipsum vitae ullamcorper gravida aliquam laoreet elementum donec vestibulum dictumst tortor',
      imagen: 'https://images.unsplash.com/photo-1590650003894-41e6a3e54bd3?auto=format&fit=crop&w=800&q=60'
    }
  ];
}
