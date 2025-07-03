import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-translated-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-logo">
          <img src="AgroDigital_Logo.png" alt="AgroDigital Logo">
        </div>

        <div class="social-icons">
          <a href="https://www.facebook.com" target="_blank" class="social-icon facebook">
            <div class="icon-circle">f</div>
          </a>
          <a href="https://www.instagram.com" target="_blank" class="social-icon linkedin">
            <div class="icon-circle">in</div>
          </a>
          <a href="https://www.twitter.com" target="_blank" class="social-icon twitter">
            <div class="icon-circle">𝕏</div>
          </a>
        </div>

        <div class="footer-links">
          <a href="#" class="footer-link">{{privacyPolicy}}</a>
          <a href="#" class="footer-link">{{cookiePolicy}}</a>
          <a href="#" class="footer-link">{{legalNotice}}</a>
        </div>

        <div class="copyright">
          © {{ currentYear }} GanTrace. {{allRightsReserved}}
        </div>
      </div>
    </footer>
  `,
  styleUrls: ['../footer-component/footer-component.component.css']
})
export class TranslatedFooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();

  // Textos traducidos en español
  privacyPolicyEs: string = 'Política de privacidad';
  cookiePolicyEs: string = 'Política de cookies';
  legalNoticeEs: string = 'Aviso Legal';
  allRightsReservedEs: string = 'Todos los derechos reservados.';

  // Textos traducidos en inglés
  privacyPolicyEn: string = 'Privacy Policy';
  cookiePolicyEn: string = 'Cookie Policy';
  legalNoticeEn: string = 'Legal Notice';
  allRightsReservedEn: string = 'All Rights Reserved.';

  // Variables para mostrar el texto actual
  privacyPolicy: string = '';
  cookiePolicy: string = '';
  legalNotice: string = '';
  allRightsReserved: string = '';

  constructor() {}

  ngOnInit(): void {
    // Configurar textos iniciales basados en el idioma guardado
    this.updateTexts();

    // Escuchar cambios de idioma
    window.addEventListener('storage', (event) => {
      if (event.key === 'preferredLanguage') {
        this.updateTexts();
      }
    });

    // Escuchar evento personalizado
    window.addEventListener('language-changed', () => {
      this.updateTexts();
    });
  }

  updateTexts(): void {
    const currentLang = localStorage.getItem('preferredLanguage') || 'es';

    if (currentLang === 'en') {
      this.privacyPolicy = this.privacyPolicyEn;
      this.cookiePolicy = this.cookiePolicyEn;
      this.legalNotice = this.legalNoticeEn;
      this.allRightsReserved = this.allRightsReservedEn;
    } else {
      this.privacyPolicy = this.privacyPolicyEs;
      this.cookiePolicy = this.cookiePolicyEs;
      this.legalNotice = this.legalNoticeEs;
      this.allRightsReserved = this.allRightsReservedEs;
    }
  }
}
