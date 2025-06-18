import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../public/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class EconomicService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getTotalIncome(): Observable<number> {
    const currentUser = this.authService.getCurrentUser();
    const userId = currentUser ? currentUser.id : null;
    
    if (!userId) {
      console.error('No user logged in');
      return of(0);
    }
    
    return this.http.get<any[]>(`${this.apiUrl}/incomes/user/${userId}`).pipe(
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
    const currentUser = this.authService.getCurrentUser();
    const userId = currentUser ? currentUser.id : null;
    
    if (!userId) {
      console.error('No user logged in');
      return of(0);
    }
    
    return this.http.get<any[]>(`${this.apiUrl}/expenses/user/${userId}`).pipe(
      map(expenses => {
        return expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
      }),
      catchError(error => {
        console.error('Error fetching expenses', error);
        return of(0);
      })
    );
  }

  addExpense(expense: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/expenses`, expense);
  }

  addIncome(income: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/incomes`, income);
  }

  addTransaction(transaction: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/transactions`, transaction);
  }

  getRecentTransactions(limit: number = 10): Observable<any[]> {
    const currentUser = this.authService.getCurrentUser();
    const userId = currentUser ? currentUser.id : null;
    
    if (!userId) {
      console.error('No user logged in');
      return of([]);
    }
    
    return this.http.get<any[]>(`${this.apiUrl}/transactions/user/${userId}/recent?limit=${limit}`).pipe(
      catchError(error => {
        console.error('Error fetching transactions', error);
        return of([]);
      })
    );
  }

  getIncomes(): Observable<any[]> {
    const currentUser = this.authService.getCurrentUser();
    const userId = currentUser ? currentUser.id : null;
    
    if (!userId) {
      console.error('No user logged in');
      return of([]);
    }
    
    return this.http.get<any[]>(`${this.apiUrl}/incomes/user/${userId}`).pipe(
      catchError(error => {
        console.error('Error fetching incomes', error);
        return of([]);
      })
    );
  }

  getExpenses(): Observable<any[]> {
    const currentUser = this.authService.getCurrentUser();
    const userId = currentUser ? currentUser.id : null;
    
    if (!userId) {
      console.error('No user logged in');
      return of([]);
    }
    
    return this.http.get<any[]>(`${this.apiUrl}/expenses/user/${userId}`).pipe(
      catchError(error => {
        console.error('Error fetching expenses', error);
        return of([]);
      })
    );
  }

  updateIncome(id: number, income: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/incomes/${id}`, income);
  }

  updateExpense(id: number, expense: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/expenses/${id}`, expense);
  }

  deleteIncome(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/incomes/${id}`);
  }

  deleteExpense(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/expenses/${id}`);
  }

  deleteTransaction(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/transactions/${id}`);
  }

  getTransactionById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/transactions/${id}`);
  }
}