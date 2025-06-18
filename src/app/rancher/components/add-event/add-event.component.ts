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
      return;
    }

    // Verificar que el usuario tenga rol de rancher
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'rancher') {
      console.error('Usuario no tiene permisos para crear eventos');
      alert('No tienes permisos para crear eventos. Solo los ganaderos pueden crear eventos.');
      this.router.navigate(['/dashboard']);
      return;
    }

    this.eventForm.get('imagen')?.valueChanges.subscribe(url => {
      this.previewImageUrl = url;
    });
  }

  onSubmit(): void {
    if (this.eventForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const currentUser = this.authService.getCurrentUser();
      
      // Verificar nuevamente el rol antes de enviar
      if (!currentUser || currentUser.role !== 'rancher') {
        console.error('Usuario no tiene permisos para crear eventos');
        alert('No tienes permisos para crear eventos.');
        this.isSubmitting = false;
        return;
      }
      
      // Asegurar que todos los campos requeridos estén presentes
      const newEvent: Event = {
        tipo: this.eventForm.value.tipo,
        titulo: this.eventForm.value.titulo,
        fecha: this.eventForm.value.fecha,
        descripcion: this.eventForm.value.descripcion,
        imagen: this.eventForm.value.imagen,
        creatorId: currentUser.id,
        creatorName: currentUser.name
      };
      
      console.log('Enviando evento:', newEvent);
      
      this.eventService.addEvent(newEvent).subscribe({
        next: (event) => {
          console.log('Evento creado exitosamente:', event);
          alert('Evento creado exitosamente');
          this.router.navigate(['/events']);
        },
        error: (error) => {
          console.error('Error al crear el evento:', error);
          
          // Manejar diferentes tipos de errores
          if (error.status === 400) {
            alert('Error: Datos inválidos o usuario no existe. Verifica todos los campos.');
          } else if (error.status === 403) {
            alert('Error: No tienes permisos para crear eventos.');
          } else {
            alert('Error al crear el evento. Inténtalo de nuevo.');
          }
          
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    } else if (!this.isSubmitting) {
      console.log('Formulario inválido:', this.eventForm.errors);
      Object.keys(this.eventForm.controls).forEach(key => {
        const control = this.eventForm.get(key);
        if (control?.invalid) {
          console.log(`Campo ${key} inválido:`, control.errors);
        }
        control?.markAsTouched();
      });
      alert('Por favor, completa todos los campos requeridos.');
    }
  }

  cancel(): void {
    this.router.navigate(['/events']);
  }
}
