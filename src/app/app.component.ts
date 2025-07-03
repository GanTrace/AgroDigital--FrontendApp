import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { I18nService } from './services/i18n.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'AgroDigital--FrontendApp';

  constructor(
    private i18nService: I18nService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    // Configurar manualmente las traducciones
    const savedLang = localStorage.getItem('preferredLanguage') || 'es';
    this.translate.setDefaultLang('es');
    this.translate.use(savedLang);

    // Disparar evento para que los componentes se actualicen
    window.dispatchEvent(new Event('language-changed'));
  }
}
