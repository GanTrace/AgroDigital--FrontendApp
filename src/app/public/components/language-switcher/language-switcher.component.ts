import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.css']
})
export class LanguageSwitcherComponent implements OnInit {
  languages = [
    { code: 'es', name: 'Español' },
    { code: 'en', name: 'English' }
  ];
  
  currentLang: string = 'es';

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    // Get saved language or use default
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
      this.currentLang = savedLang;
      this.translate.use(savedLang);
    } else {
      this.currentLang = this.translate.getDefaultLang() || 'es';
    }
  }

  switchLanguage(langCode: string): void {
    this.translate.use(langCode);
    this.currentLang = langCode;
    localStorage.setItem('preferredLanguage', langCode);
  }
}
