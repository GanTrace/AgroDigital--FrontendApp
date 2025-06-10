import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FooterComponentComponent } from '../../components/footer-component/footer-component.component';
import { LanguageSwitcherComponent } from '../../components/language-switcher/language-switcher.component';
import { AuthService, User } from '../../services/auth.service'; 
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
  userRole: string = 'rancher'; 
  
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
      this.userRole = currentUser.role || 'rancher';
      
      if (this.userRole === 'veterinarian') {
        this.animalCount = '0 pacientes';
      }
      
      this.authService.getUserById(currentUser.id).subscribe({
        next: (userData) => {
          this.user = userData; 
          this.settingsForm.patchValue({
            name: userData.name,
            email: userData.email,
            password: '••••••••',
            role: userData.role || 'rancher'
          });
          
          if (userData.profileImage) {
            this.profileImageUrl = userData.profileImage;
          }
        }
      });
    }
  }

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
  
  deleteProfileImage(): void {
    this.profileImageUrl = null; 
    this.showImageUrlInput = false;
    this.imageUrl = '';
  }
  
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
      
      updatedUser.profileImage = this.profileImageUrl;
      
      this.authService.updateUser(updatedUser).subscribe({
        next: (user) => {
          console.log('Profile updated successfully:', user);
          this.user = user;
          this.isEditing = false;
          
         
          localStorage.setItem('user', JSON.stringify(user));
        },
        error: (error) => {
          console.error('Error updating profile:', error);
        }
      });
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    
    if (this.showPassword && this.user) {
      this.authService.getUserById(this.user.id!).subscribe(userData => {
        if (userData && userData.password) {
          this.settingsForm.patchValue({
            password: userData.password
          });
        }
      });
    } else {
      this.settingsForm.patchValue({
        password: '••••••••'
      });
    }
  }
  
  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }
  
  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    
    if (!this.isEditing) {
      this.showImageUrlInput = false;
      this.imageUrl = '';
      
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
  
  navigateBack(): void {
    if (this.userRole === 'veterinarian') {
      this.router.navigate(['/veterinarian/dashboard']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
  
  navigateToSettings(): void {
    if (this.userRole === 'veterinarian') {
      this.router.navigate(['/veterinarian/settings']);
    } else {
      this.router.navigate(['/settings']);
    }
  }
}
