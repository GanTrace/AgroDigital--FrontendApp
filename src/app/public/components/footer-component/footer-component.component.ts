import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef, ChangeDetectionStrategy, ApplicationRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subscription, filter, take } from 'rxjs';
import { I18nService } from '../../../services/i18n.service';

@Component({
  selector: 'app-footer-component',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './footer-component.component.html',
  styleUrls: ['./footer-component.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class FooterComponentComponent implements OnInit, OnDestroy {
  currentYear: number = new Date().getFullYear();
  private subscriptions: Subscription[] = [];
  isTranslationsLoaded: boolean = false;

  constructor(
    private translate: TranslateService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private i18nService: I18nService,
    private appRef: ApplicationRef
  ) {}

  ngOnInit(): void {
    // Esperar a que las traducciones estén cargadas
    this.loadTranslations();

    // Suscribirse a los cambios de idioma
    this.subscriptions.push(
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.zone.run(() => {
          // Asegurarse de que las traducciones estén cargadas
          this.isTranslationsLoaded = false;
          this.loadTranslations();
          this.cdr.detectChanges();
        });
      })
    );

    // Suscribirse al servicio I18n
    this.subscriptions.push(
      this.i18nService.language$.pipe(
        filter(lang => !!lang)
      ).subscribe(lang => {
        this.zone.run(() => {
          // Asegurarse de que las traducciones estén cargadas
          this.isTranslationsLoaded = false;
          this.loadTranslations();
          this.cdr.detectChanges();
        });
      })
    );
  }

  private loadTranslations(): void {
    const currentLang = this.translate.currentLang || this.translate.defaultLang;

    // Forzar la carga de traducciones si no están ya cargadas
    this.translate.getTranslation(currentLang).pipe(
      take(1)
    ).subscribe(() => {
      this.zone.run(() => {
        this.isTranslationsLoaded = true;
        this.cdr.detectChanges();
        this.appRef.tick();
      });
    });
  }

  ngOnDestroy(): void {
    // Limpiar todas las suscripciones
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
