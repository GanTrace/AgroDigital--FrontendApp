import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from '../../components/language-switcher/language-switcher.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    LanguageSwitcherComponent
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  showPassword = false;
  registrationError = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]],
    });
  }

  ngOnInit(): void {
    // Set default language or get from localStorage
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
      this.translate.use(savedLang);
    } else {
      // Default to Spanish
      this.translate.use('es');
    }
  }

  passwordStrengthValidator(control: any) {
    const value = control.value || '';
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
    
    const valid = hasLetter && hasNumber && hasSpecial;
    return valid ? null : { strength: true };
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.registrationError = '';
    
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: (res) => {
          // Store user data in localStorage
          localStorage.setItem('user', JSON.stringify({
            id: Date.now(),
            name: this.registerForm.value.name,
            email: this.registerForm.value.email,
            role: 'rancher'
          }));
          
          // Navigate to dashboard
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.registrationError = this.translate.instant('REGISTER.REGISTRATION_ERROR');
          console.error('Registration error:', err);
        }
      });
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
      
      if (this.registerForm.get('password')?.hasError('strength')) {
        this.registrationError = this.translate.instant('REGISTER.PASSWORD_STRENGTH_ERROR');
      } else {
        this.registrationError = this.translate.instant('REGISTER.FORM_ERROR');
      }
    }
  }
}
