import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../../../public/components/header-component/header-component.component';
import { FooterComponentComponent } from '../../../public/components/footer-component/footer-component.component';
import { AuthService } from '../../../public/services/auth.service';

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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private translate: TranslateService,
    private authService: AuthService
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

    // Verificar si el usuario está autenticado
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }

    // Suscribirse a cambios en el campo de imagen para mostrar la vista previa
    this.eventForm.get('imagen')?.valueChanges.subscribe(url => {
      this.previewImageUrl = url;
    });
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      // Aquí iría la lógica para guardar el evento
      // Por ahora, simplemente vamos a imprimir los datos y redirigir
      console.log('Evento creado:', this.eventForm.value);
      
      // En un caso real, aquí se enviaría el evento a un servicio
      // this.eventService.addEvent(this.eventForm.value).subscribe(...)
      
      // Redirigir a la página de eventos
      this.router.navigate(['/events']);
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.eventForm.controls).forEach(key => {
        const control = this.eventForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  // Método para cancelar y volver a la página de eventos
  cancel(): void {
    this.router.navigate(['/events']);
  }
}
