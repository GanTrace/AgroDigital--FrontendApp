import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EconomicService } from '../../services/economic.service';
import { AuthService } from '../../../public/services/auth.service';

@Component({
  selector: 'app-add-expense',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.css']
})
export class AddExpenseComponent implements OnInit {
  expenseForm: FormGroup;
  categories: string[] = [
    'Veterinario',
    'Alimentación',
    'Equipamiento',
    'Suministros',
    'Mantenimiento',
    'Otros Gastos'
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private translate: TranslateService,
    private economicService: EconomicService,
    private authService: AuthService
  ) {
    this.expenseForm = this.fb.group({
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
    if (this.expenseForm.valid) {
      const currentUser = this.authService.getCurrentUser();
      const userId = currentUser ? currentUser.id : null;
      const userName = currentUser ? currentUser.name : 'Unknown';

      const expense = {
        amount: parseFloat(this.expenseForm.value.amount),
        description: this.expenseForm.value.description,
        category: this.expenseForm.value.category,
        date: new Date().toISOString(),
        type: 'expense',
        userId: userId,
        userName: userName
      };

      this.economicService.addExpense(expense).subscribe({
        next: () => {
          this.economicService.addTransaction({...expense}).subscribe();
          this.router.navigate(['/economic-control']);
        },
        error: (error) => {
          console.error('Error adding expense', error);
        }
      });
    } else {
      Object.keys(this.expenseForm.controls).forEach(key => {
        this.expenseForm.get(key)?.markAsTouched();
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/economic-control']);
  }
}
