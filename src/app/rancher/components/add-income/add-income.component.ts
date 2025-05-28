import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EconomicService } from '../../services/economic.service';
import { AuthService } from '../../../public/services/auth.service';

@Component({
  selector: 'app-add-income',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './add-income.component.html',
  styleUrls: ['./add-income.component.css']
})
export class AddIncomeComponent implements OnInit {
  incomeForm: FormGroup;
  categories: string[] = [
    'Ventas',
    'Servicios',
    'Inversiones',
    'Otros Ingresos'
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private translate: TranslateService,
    private economicService: EconomicService,
    private authService: AuthService
  ) {
    this.incomeForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required, Validators.maxLength(100)]],
      category: [this.categories[0], Validators.required]
    });
  }

  ngOnInit(): void {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
      this.translate.use(savedLang);
    }
  }

  onSubmit(): void {
    if (this.incomeForm.valid) {
      const currentUser = this.authService.getCurrentUser();
      const userId = currentUser ? currentUser.id : null;
      const userName = currentUser ? currentUser.name : 'Unknown';

      const income = {
        amount: parseFloat(this.incomeForm.value.amount),
        description: this.incomeForm.value.description,
        category: this.incomeForm.value.category,
        date: new Date().toISOString(),
        type: 'income',
        userId: userId,
        userName: userName
      };

      this.economicService.addIncome(income).subscribe({
        next: () => {
          // Also add to transactions for unified view
          this.economicService.addTransaction({...income}).subscribe();
          this.router.navigate(['/economic-control']);
        },
        error: (error) => {
          console.error('Error adding income', error);
        }
      });
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.incomeForm.controls).forEach(key => {
        this.incomeForm.get(key)?.markAsTouched();
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/economic-control']);
  }
}
