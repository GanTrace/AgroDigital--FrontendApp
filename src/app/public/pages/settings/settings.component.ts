import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FooterComponentComponent } from '../../components/footer-component/footer-component.component';
import { LanguageSwitcherComponent } from '../../components/language-switcher/language-switcher.component';
import { AuthService, User } from '../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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
  actualPassword: string = '';
  
  constructor(
    private translate: TranslateService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient
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
    if (this.user && this.user.id !== undefined) {
      this.getUserPassword(this.user.id);
      
      this.settingsForm.patchValue({
        name: this.user.name,
        email: this.user.email,
        password: '••••••••', 
        role: this.user.role || 'rancher'
      });
    }
  }
  
  getUserPassword(userId: number): void {
    this.http.get<User>(`http://localhost:3000/users/${userId}`).subscribe(
      (userData) => {
        this.actualPassword = userData.password;
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }
  
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    
    if (this.showPassword && this.actualPassword) {
      this.settingsForm.patchValue({
        password: this.actualPassword
      });
    } else {
      if (!this.isEditing) {
        this.settingsForm.patchValue({
          password: '••••••••'
        });
      }
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    
    if (this.isEditing && this.actualPassword) {
      if (this.showPassword) {
        this.settingsForm.patchValue({
          password: this.actualPassword
        });
      }
    } else if (!this.isEditing && this.user) {
      this.settingsForm.patchValue({
        name: this.user.name,
        email: this.user.email,
        password: this.showPassword ? this.actualPassword : '••••••••',
        role: this.user.role || 'rancher'
      });
    }
  }

  updateProfile(): void {
    if (!this.user || this.user.id === undefined) return;
    
    let passwordToSave = this.settingsForm.value.password;
    if (passwordToSave === '••••••••') {
      passwordToSave = this.actualPassword;
    }
    
    const updatedData = {
      ...this.user,
      name: this.settingsForm.value.name,
      password: passwordToSave
    };
    
    this.http.put<User>(`http://localhost:3000/users/${this.user.id}`, updatedData).subscribe(
      (response) => {
        console.log('Profile updated successfully:', response);
        
        this.user = response;
        this.actualPassword = passwordToSave; 
        
        this.authService.updateCurrentUser(response);
        
        this.isEditing = false;
        
        alert('Profile updated successfully!');
      },
      (error) => {
        console.error('Error updating profile:', error);
        alert('Error updating profile. Please try again.');
      }
    );
  }
  
  logout(): void {
    this.authService.logout();
  }
}
