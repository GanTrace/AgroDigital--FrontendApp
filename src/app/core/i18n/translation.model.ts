/**
 * Modelo de dominio para traducciones siguiendo principios DDD
 */

export interface Translation {
  key: string;
  value: string;
  locale: string;
}

export interface TranslationGroup {
  groupKey: string;
  translations: Translation[];
}

export class LocaleSettings {
  constructor(
    public code: string,
    public name: string,
    public isDefault: boolean = false
  ) {}

  static getSupportedLocales(): LocaleSettings[] {
    return [
      new LocaleSettings('es', 'Español', true),
      new LocaleSettings('en', 'English')
    ];
  }

  static getDefaultLocale(): string {
    const defaultLocale = this.getSupportedLocales().find(locale => locale.isDefault);
    return defaultLocale ? defaultLocale.code : 'es';
  }
}
