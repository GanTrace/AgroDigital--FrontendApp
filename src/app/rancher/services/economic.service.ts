import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

interface Transaction {
  id: number;
  date: string;
  amount: number;
  category: string;
  description: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class EconomicService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getTotalIncome(): Observable<number> {
    return this.http.get<any[]>(`${this.apiUrl}/incomes`).pipe(
      map(incomes => {
        return incomes.reduce((total, income) => total + parseFloat(income.amount), 0);
      }),
      catchError(error => {
        console.error('Error fetching incomes', error);
        return of(0);
      })
    );
  }

  getTotalExpense(): Observable<number> {
    return this.http.get<any[]>(`${this.apiUrl}/expenses`).pipe(
      map(expenses => {
        return expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
      }),
      catchError(error => {
        console.error('Error fetching expenses', error);
        return of(0);
      })
    );
  }
  
  // Add the missing methods
  addExpense(expense: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/expenses`, expense);
  }
  
  addIncome(income: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/incomes`, income);
  }
  
  getRecentTransactions(): Observable<Transaction[]> {
    // Combine incomes and expenses
    return this.combineIncomesAndExpenses().pipe(
      map(transactions => {
        return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);
      }),
      catchError(error => {
        console.error('Error fetching transactions', error);
        // Return some mock data if API fails
        return of([
          {
            id: 1,
            date: new Date().toISOString(),
            amount: 1500,
            category: 'sales',
            description: 'Venta de leche',
            type: 'income'
          },
          {
            id: 2,
            date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
            amount: 500,
            category: 'veterinary',
            description: 'Consulta veterinaria',
            type: 'expense'
          },
          {
            id: 3,
            date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            amount: 800,
            category: 'feed',
            description: 'Compra de alimento',
            type: 'expense'
          }
        ]);
      })
    );
  }

  private combineIncomesAndExpenses(): Observable<Transaction[]> {
    return new Observable(observer => {
      let transactions: Transaction[] = [];
      
      // Get incomes
      this.http.get<any[]>(`${this.apiUrl}/incomes`).subscribe(
        incomes => {
          const formattedIncomes = incomes.map(income => ({
            ...income,
            type: 'income'
          }));
          transactions = [...transactions, ...formattedIncomes];
          
          // Get expenses
          this.http.get<any[]>(`${this.apiUrl}/expenses`).subscribe(
            expenses => {
              const formattedExpenses = expenses.map(expense => ({
                ...expense,
                type: 'expense'
              }));
              transactions = [...transactions, ...formattedExpenses];
              observer.next(transactions);
              observer.complete();
            },
            error => {
              console.error('Error fetching expenses', error);
              observer.next(transactions); // Return just incomes if expenses fail
              observer.complete();
            }
          );
        },
        error => {
          console.error('Error fetching incomes', error);
          // Try to get expenses even if incomes fail
          this.http.get<any[]>(`${this.apiUrl}/expenses`).subscribe(
            expenses => {
              const formattedExpenses = expenses.map(expense => ({
                ...expense,
                type: 'expense'
              }));
              observer.next(formattedExpenses);
              observer.complete();
            },
            err => {
              console.error('Error fetching expenses', err);
              observer.next([]); // Return empty array if both fail
              observer.complete();
            }
          );
        }
      );
    });
  }
}