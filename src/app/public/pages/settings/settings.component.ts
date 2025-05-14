import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FooterComponentComponent } from '../../components/footer-component/footer-component.component';
import { LanguageSwitcherComponent } from '../../components/language-switcher/language-switcher.component';
import { AuthService, User } from '../../services/auth.service'; // Importamos User directamente
import { NotificationsComponent } from '../../pages/notifications/notifications.component';
import { HeaderComponent } from '../../components/header-component/header-component.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    FooterComponentComponent,
    LanguageSwitcherComponent,
    NotificationsComponent,
    HeaderComponent
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  user: User | null = null;
  animalCount: string = '0 animales';
  showNotifications: boolean = false;
  isEditing: boolean = false;
  showPassword: boolean = false;
  settingsForm: FormGroup;
  
  // Propiedades para la imagen
  profileImageUrl: string | null = null;
  showImageUrlInput: boolean = false;
  imageUrl: string = '';

  constructor(
    private translate: TranslateService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.settingsForm = this.fb.group({
      name: [''],
      email: [''],
      password: [''],
      role: ['']
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
    
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.id !== undefined) {
      this.authService.getUserById(currentUser.id).subscribe({
        next: (userData) => {
          this.user = userData; 
          this.settingsForm.patchValue({
            name: userData.name,
            email: userData.email,
            password: '••••••••',
            role: userData.role || 'rancher'
          });
          
          // Cargar la imagen de perfil si existe
          if (userData.profileImage) {
            this.profileImageUrl = userData.profileImage;
          }
        }
      });
    }
  }

  // Métodos para manejar la URL de la imagen
  toggleImageUrlInput(): void {
    if (!this.isEditing) {
      return;
    }
    
    this.showImageUrlInput = !this.showImageUrlInput;
    if (!this.showImageUrlInput) {
      this.imageUrl = '';
    }
  }
  
  applyImageUrl(): void {
    if (this.imageUrl && this.imageUrl.trim() !== '') {
      this.profileImageUrl = this.imageUrl;
      this.showImageUrlInput = false;
    }
  }
  
  // Actualizar el método updateProfile para incluir la imagen
  // Añadir método para eliminar la imagen de perfil
  deleteProfileImage(): void {
    this.profileImageUrl = null; // Ahora esto es válido con la interfaz actualizada
    // Cerrar el panel de URL si está abierto
    this.showImageUrlInput = false;
    this.imageUrl = '';
  }
  
  // Modificar el método updateProfile para manejar la eliminación de la imagen
  updateProfile(): void {
    const formData = this.settingsForm.value;
    
    if (this.user) {
      const updatedUser: User = {
        ...this.user,
        name: formData.name,
        email: formData.email
      };
      
      if (formData.password !== '••••••••') {
        updatedUser.password = formData.password;
      }
      
      // Actualizar la imagen de perfil
      // Si profileImageUrl es null, se eliminará la imagen
      updatedUser.profileImage = this.profileImageUrl;
      
      this.authService.updateUser(updatedUser).subscribe({
        next: (user) => {
          console.log('Profile updated successfully:', user);
          this.user = user;
          this.isEditing = false;
          
          // Actualizar el usuario en localStorage para que el header-component lo detecte
          localStorage.setItem('user', JSON.stringify(user));
        },
        error: (error) => {
          console.error('Error updating profile:', error);
        }
      });
    }
  }
  
  // Métodos existentes
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  
  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }
  
  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    
    // Si se está saliendo del modo edición, cerrar el panel de URL
    if (!this.isEditing) {
      this.showImageUrlInput = false;
      this.imageUrl = '';
      
      // Restaurar los valores originales del formulario
      if (this.user) {
        this.settingsForm.patchValue({
          name: this.user.name,
          email: this.user.email,
          password: '••••••••',
          role: this.user.role || 'rancher'
        });
      }
    }
  }
  
  logout(): void {
    this.authService.logout();
  }
}
