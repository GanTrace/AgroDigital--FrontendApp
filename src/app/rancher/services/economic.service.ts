import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Transaction {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  category?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EconomicService {
  private totalIncome = new BehaviorSubject<number>(1485);
  private totalExpense = new BehaviorSubject<number>(1485);
  private transactions: Transaction[] = [];
  private nextId = 1;

  constructor() {
    const storedIncome = localStorage.getItem('totalIncome');
    const storedExpense = localStorage.getItem('totalExpense');
    const storedTransactions = localStorage.getItem('transactions');

    if (storedIncome) {
      this.totalIncome.next(Number(storedIncome));
    }
    
    if (storedExpense) {
      this.totalExpense.next(Number(storedExpense));
    }
    
    if (storedTransactions) {
      this.transactions = JSON.parse(storedTransactions);
      if (this.transactions.length > 0) {
        this.nextId = Math.max(...this.transactions.map(t => t.id)) + 1;
      }
    }
  }

  getTotalIncome(): Observable<number> {
    return this.totalIncome.asObservable();
  }

  getTotalExpense(): Observable<number> {
    return this.totalExpense.asObservable();
  }

  getTransactions(): Transaction[] {
    return [...this.transactions];
  }

  addIncome(amount: number, description: string, category?: string): void {
    const currentTotal = this.totalIncome.value;
    const newTotal = currentTotal + amount;
    

    this.totalIncome.next(newTotal);
    localStorage.setItem('totalIncome', newTotal.toString());
    
    const transaction: Transaction = {
      id: this.nextId++,
      type: 'income',
      amount,
      description,
      date: new Date().toISOString(),
      category
    };
    
    this.transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(this.transactions));
  }

  addExpense(amount: number, description: string, category?: string): void {
    const currentTotal = this.totalExpense.value;
    const newTotal = currentTotal + amount;
    
    this.totalExpense.next(newTotal);
    localStorage.setItem('totalExpense', newTotal.toString());
    
    const transaction: Transaction = {
      id: this.nextId++,
      type: 'expense',
      amount,
      description,
      date: new Date().toISOString(),
      category
    };
    
    this.transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(this.transactions));
  }
}