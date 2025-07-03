import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { I18nService } from '../../../services/i18n.service';
import { LocaleSettings } from '../../../core/i18n/translation.model';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.css']
})
export class LanguageSwitcherComponent implements OnInit {
  languages = LocaleSettings.getSupportedLocales();

  currentLang: string = 'es';

  constructor(
    private translate: TranslateService,
    private ngZone: NgZone,
    private i18nService: I18nService
  ) {}

  ngOnInit(): void {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
      this.currentLang = savedLang;
      this.translate.use(savedLang);
    } else {
      this.currentLang = this.translate.getDefaultLang() || 'es';
    }
  }

  switchLanguage(langCode: string): void {
    if (this.currentLang !== langCode) {
      this.ngZone.run(() => {
        // Actualizar idioma en el servicio
        this.i18nService.setLanguage(langCode);
        this.currentLang = langCode;

        // Disparar evento personalizado para el nuevo footer
        window.dispatchEvent(new Event('language-changed'));

        // Evitar la recarga completa que afecta a la experiencia de usuario
        // window.location.reload();
      });
    }
  }
}
