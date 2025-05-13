import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FooterComponentComponent } from '../../../public/components/footer-component/footer-component.component';
import { LanguageSwitcherComponent } from '../../../public/components/language-switcher/language-switcher.component';
import { AuthService } from '../../../public/services/auth.service';
import { NotificationsComponent } from '../../../public/pages/notifications/notifications.component';

@Component({
  selector: 'app-animals',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    ReactiveFormsModule,
    FooterComponentComponent,
    LanguageSwitcherComponent,
    NotificationsComponent  
  ],
  templateUrl: './animals.component.html',
  styleUrl: './animals.component.css'
})
export class AnimalsComponent implements OnInit {
  animalForm: FormGroup;
  userName: string = '';
  animalCount: string = '580 animales';
  nextAnimalId: number = 581;
  showNotifications: boolean = false; 

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private translate: TranslateService,
    private authService: AuthService
  ) {
    this.animalForm = this.fb.group({
      nombre: [''],
      especie: [''],
      fechaNacimiento: [''],
      sexo: [''],
      enfermedad: [''],
      estadoReproductivo: [''],
      vacunasAplicadas: [''],
      numeroPartos: [''],
      ubicacion: [''],
      observaciones: ['']
    });
  }

  ngOnInit(): void {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
      this.translate.use(savedLang);
    }

    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.name;
    }
  }

  toggleNotifications(): void {  
    this.showNotifications = !this.showNotifications;
  }

  addAnimal(): void {
    console.log('Animal data:', this.animalForm.value);

    this.router.navigate(['/dashboard']);
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.authService.logout();
  }
}
