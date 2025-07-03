import { Injectable, NgZone } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { LocaleSettings } from '../core/i18n/translation.model';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private languageSubject = new BehaviorSubject<string>('');
  public language$ = this.languageSubject.asObservable();

  constructor(private translate: TranslateService, private ngZone: NgZone) {
    // Inicializar con el idioma guardado o el predeterminado
    const savedLang = localStorage.getItem('preferredLanguage');
    const defaultLang = LocaleSettings.getDefaultLocale();
    const initialLang = savedLang || defaultLang;

    // Configurar el idioma predeterminado y el actual
    this.translate.setDefaultLang(defaultLang);
    this.translate.use(initialLang);

    // Precargar todos los idiomas disponibles
    LocaleSettings.getSupportedLocales().forEach(locale => {
      this.translate.getTranslation(locale.code);
    });

    // Establecer el valor inicial del subject
    this.languageSubject.next(initialLang);
  }

  setLanguage(langCode: string, savePreference: boolean = true): void {
    this.ngZone.run(() => {
      // Cambiar el idioma directamente
      this.translate.use(langCode);

      // Guardar preferencia en localStorage
      if (savePreference) {
        localStorage.setItem('preferredLanguage', langCode);
      }

      // Notificar a todos los componentes suscritos
      this.languageSubject.next(langCode);

      // Disparar evento para componentes que escuchan directamente
      window.dispatchEvent(new Event('language-changed'));
    });
  }

  getCurrentLanguage(): string {
    return this.translate.currentLang || this.translate.getDefaultLang() || 'es';
  }

  instant(key: string): string {
    return this.translate.instant(key);
  }
}
