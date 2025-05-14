import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { EconomicService } from '../../services/economic.service';

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
    'ECONOMIC_CONTROL.EXPENSE_CATEGORIES.SUPPLIES',
    'ECONOMIC_CONTROL.EXPENSE_CATEGORIES.EQUIPMENT',
    'ECONOMIC_CONTROL.EXPENSE_CATEGORIES.VETERINARY',
    'ECONOMIC_CONTROL.EXPENSE_CATEGORIES.FEED',
    'ECONOMIC_CONTROL.EXPENSE_CATEGORIES.MAINTENANCE',
    'ECONOMIC_CONTROL.EXPENSE_CATEGORIES.OTHER'
  ];

  constructor(
    private fb: FormBuilder,
    private economicService: EconomicService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.expenseForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required, Validators.maxLength(100)]],
      category: ['ECONOMIC_CONTROL.EXPENSE_CATEGORIES.SUPPLIES']
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
      const { amount, description, category } = this.expenseForm.value;
      this.economicService.addExpense(Number(amount), description, category);
      this.router.navigate(['/economic-control']);
    } else {
      Object.keys(this.expenseForm.controls).forEach(key => {
        const control = this.expenseForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/economic-control']);
  }
}
