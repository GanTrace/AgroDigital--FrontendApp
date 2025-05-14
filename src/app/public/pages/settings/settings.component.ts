import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FooterComponentComponent } from '../../components/footer-component/footer-component.component';
import { LanguageSwitcherComponent } from '../../components/language-switcher/language-switcher.component';
import { AuthService } from '../../services/auth.service';
import { NotificationsComponent } from '../../pages/notifications/notifications.component';

@Component({
  selector: 'app-settings',
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
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  user: any;
  animalCount: string = '0 animales';
  showNotifications: boolean = false;
  isEditing: boolean = false;
  showPassword: boolean = false;
  settingsForm: FormGroup;

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
    
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.authService.getUserById(this.user.id).subscribe({
        next: (userData) => {
          this.user = userData; 
          this.settingsForm.patchValue({
            name: userData.name,
            email: userData.email,
            password: '••••••••',
            role: userData.role || 'rancher'
          });
        }
      });
    }
}

togglePasswordVisibility(): void {
  this.showPassword = !this.showPassword;
  if (this.showPassword && this.user) {
    this.settingsForm.patchValue({
      password: this.user.password
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
    if (!this.isEditing && this.user) {
      this.settingsForm.patchValue({
        name: this.user.name,
        email: this.user.email,
        password: '••••••••',
        role: this.user.role || 'rancher'
      });
    }
  }
  
  updateProfile(): void {
    const formData = this.settingsForm.value;
    
    if (this.user) {
      const updatedUser = {
        ...this.user,
        name: formData.name,
        email: formData.email
      };
      
      if (formData.password !== '••••••••') {
        updatedUser.password = formData.password;
      }
      
      this.authService.updateUser(updatedUser).subscribe({
        next: (user) => {
          console.log('Profile updated successfully:', user);
          this.user = user;
          this.isEditing = false;
        },
        error: (error) => {
          console.error('Error updating profile:', error);
        }
      });
    }
  }
  
  logout(): void {
    this.authService.logout();
  }
}
