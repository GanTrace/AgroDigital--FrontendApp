import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService, User } from '../../services/auth.service';

import { FooterComponentComponent } from '../../components/footer-component/footer-component.component';
import { LanguageSwitcherComponent } from '../../components/language-switcher/language-switcher.component';

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
    FooterComponentComponent,
    LanguageSwitcherComponent
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  showPassword = false;
  errorMessage = '';
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
      this.translate.use(savedLang);
    }
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['rancher', Validators.required] 
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.translate.get('REGISTER.FORM_ERROR').subscribe((res: string) => {
        this.errorMessage = res;
      });
      return;
    }

    const password = this.registerForm.get('password')?.value;
    if (!this.isStrongPassword(password)) {
      this.translate.get('REGISTER.PASSWORD_STRENGTH_ERROR').subscribe((res: string) => {
        this.errorMessage = res;
      });
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const payload: RegisterPayload = {
      name: this.registerForm.get('name')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value,
      role: this.registerForm.get('role')?.value
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Registration error:', error);
        this.translate.get('REGISTER.REGISTRATION_ERROR').subscribe((res: string) => {
          this.errorMessage = res;
        });
      }
    });
  }

  private isStrongPassword(password: string): boolean {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    return hasLetter && hasNumber && hasSymbol;
  }
}