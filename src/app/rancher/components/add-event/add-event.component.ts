import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../../../public/components/header-component/header-component.component';
import { FooterComponentComponent } from '../../../public/components/footer-component/footer-component.component';
import { AuthService } from '../../../public/services/auth.service';
import { EventService, Event } from '../../services/event.service';

@Component({
  selector: 'app-add-event',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    ReactiveFormsModule,
    HeaderComponent,
    FooterComponentComponent
  ],
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {
  eventForm: FormGroup;
  eventTypes = ['Vacunas', 'Visita', 'Feria', 'Capacitación', 'Salud', 'Mercado', 'Tecnología'];
  previewImageUrl: string = '';
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private translate: TranslateService,
    private authService: AuthService,
    private eventService: EventService
  ) {
    this.eventForm = this.fb.group({
      tipo: ['', Validators.required],
      titulo: ['', Validators.required],
      fecha: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.maxLength(200)]],
      imagen: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
      this.translate.use(savedLang);
    }

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }

    this.eventForm.get('imagen')?.valueChanges.subscribe(url => {
      this.previewImageUrl = url;
    });
  }

  onSubmit(): void {
    if (this.eventForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      // Get current user
      const currentUser = this.authService.getCurrentUser();
      
      const newEvent: Event = {
        ...this.eventForm.value,
        creatorId: currentUser?.id || 'unknown' // Add creator ID
      };
      
      this.eventService.addEvent(newEvent).subscribe({
        next: (event) => {
          console.log('Evento creado:', event);
          this.router.navigate(['/events']);
        },
        error: (error) => {
          console.error('Error al crear el evento:', error);
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    } else if (!this.isSubmitting) {
      Object.keys(this.eventForm.controls).forEach(key => {
        const control = this.eventForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/events']);
  }
}
