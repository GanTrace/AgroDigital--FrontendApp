import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FooterComponentComponent } from '../../../public/components/footer-component/footer-component.component';
import { LanguageSwitcherComponent } from '../../../public/components/language-switcher/language-switcher.component';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    TranslateModule,
    FooterComponentComponent,
    LanguageSwitcherComponent
  ],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
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

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    // Set language from localStorage or default
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
      this.translate.use(savedLang);
    }
  }
}
