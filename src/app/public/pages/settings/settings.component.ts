import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FooterComponentComponent } from '../../components/footer-component/footer-component.component';
import { LanguageSwitcherComponent } from '../../components/language-switcher/language-switcher.component';
import { AuthService, User } from '../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    FooterComponentComponent,
    LanguageSwitcherComponent,
    ReactiveFormsModule
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  user: User | null = null;
  showPassword = false;
  animalCount = '580 animales';
  settingsForm: FormGroup;
  isEditing = false;
  
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
      // Initialize form with user data
      this.settingsForm.patchValue({
        name: this.user.name,
        email: this.user.email,
        password: '••••••••', // Placeholder for password
        role: this.user.role || 'rancher'
      });
    }
  }
  
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.user) {
      // Reset form when canceling edit
      this.settingsForm.patchValue({
        name: this.user.name,
        email: this.user.email,
        password: '••••••••',
        role: this.user.role || 'rancher'
      });
    }
  }

  updateProfile(): void {
    // In a real app, you would send this data to your backend
    console.log('Profile update requested with data:', this.settingsForm.value);
    // For now, just toggle off edit mode
    this.isEditing = false;
  }
  
  logout(): void {
    this.authService.logout();
  }
}
