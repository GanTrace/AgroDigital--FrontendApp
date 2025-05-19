import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { EconomicService } from '../../services/economic.service';

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
    'ECONOMIC_CONTROL.CATEGORIES.SALES',
    'ECONOMIC_CONTROL.CATEGORIES.SERVICES',
    'ECONOMIC_CONTROL.CATEGORIES.INVESTMENTS',
    'ECONOMIC_CONTROL.CATEGORIES.OTHER'
  ];

  constructor(
    private fb: FormBuilder,
    private economicService: EconomicService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.incomeForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required, Validators.maxLength(100)]],
      category: ['ECONOMIC_CONTROL.CATEGORIES.SALES']
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
      const incomeData = this.incomeForm.value;
      
      // Fix: Pass only one argument (the income object) to addIncome
      this.economicService.addIncome(incomeData).subscribe(
        response => {
          console.log('Income added successfully', response);
          this.router.navigate(['/economic-control']);
        },
        error => {
          console.error('Error adding income', error);
        }
      );
    } else {
      Object.keys(this.incomeForm.controls).forEach(key => {
        const control = this.incomeForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/economic-control']);
  }
}
