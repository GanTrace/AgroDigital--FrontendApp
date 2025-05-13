import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FooterComponentComponent } from '../../../public/components/footer-component/footer-component.component';
import { LanguageSwitcherComponent } from '../../../public/components/language-switcher/language-switcher.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    TranslateModule,
    FooterComponentComponent,
    LanguageSwitcherComponent
  ],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    // Set language from localStorage or default
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
      this.translate.use(savedLang);
    }
  }
}
