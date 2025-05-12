import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users'; 

  constructor(private http: HttpClient) {}

  register(payload: RegisterPayload): Observable<User> {
    return this.http.post<User>(this.apiUrl, payload);
  }

  login(payload: LoginPayload): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${payload.email}&password=${payload.password}`);
  }
}
