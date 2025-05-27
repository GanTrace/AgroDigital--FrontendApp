import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, of, tap, catchError } from 'rxjs';
import { AuthService } from '../../public/services/auth.service';

// Update the Animal interface to include the missing properties
export interface Animal {
  id: number;
  nombre: string;
  especie: string;
  sexo: string;
  fechaNacimiento: string;
  imagen: string;
  // Add these properties to fix the errors
  createdBy?: string;
  imageUrl?: string;
  // Previously added properties
  alimentacion?: string;
  peso?: string;
  numeroPartos?: number;
  ubicacion?: string;
  enfermedad?: string;
  estado?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  private apiUrl = 'http://localhost:3000/animals';
  private fallbackAnimals: Animal[] = []; 
  
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}
  
  getAnimals(): Observable<Animal[]> {
    return this.http.get<Animal[]>(this.apiUrl).pipe(
      catchError(this.handleError<Animal[]>('getAnimals', []))
    );
  }
  
  getAnimalsByUser(): Observable<Animal[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      return of([]);
    }
    
    return this.http.get<Animal[]>(`${this.apiUrl}?createdBy=${currentUser.id}`).pipe(
      catchError(error => {
        console.error('Error fetching animals by user:', error);
        return of(this.fallbackAnimals.filter(animal => animal.createdBy === currentUser.id));
      })
    );
  }
  
  getAnimalById(id: number): Observable<Animal | undefined> {
    return this.http.get<Animal>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching animal with id ${id}:`, error);
        // Return local fallback data
        return of(this.fallbackAnimals.find(animal => animal.id === id));
      })
    );
  }
  
  addAnimal(animal: Animal): Observable<Animal> {
    // Ensure we have an image property from imageUrl if provided
    if (animal.imageUrl && !animal.imagen) {
      animal.imagen = animal.imageUrl;
    }
    
    return this.http.post<Animal>(this.apiUrl, animal).pipe(
      tap(newAnimal => {
        // Add to local fallback data
        this.fallbackAnimals.push(newAnimal);
      }),
      catchError(error => {
        console.error('Error adding animal:', error);
        // Add to local fallback data and return
        animal.id = this.getNextIdForFallback();
        this.fallbackAnimals.push(animal);
        return of(animal);
      })
    );
  }
  
  updateAnimal(animal: Animal): Observable<Animal> {
    return this.http.put<Animal>(`${this.apiUrl}/${animal.id}`, animal).pipe(
      tap(updatedAnimal => {
        // Update in local fallback data
        const index = this.fallbackAnimals.findIndex(a => a.id === animal.id);
        if (index !== -1) {
          this.fallbackAnimals[index] = updatedAnimal;
        }
      }),
      catchError(error => {
        console.error(`Error updating animal with id ${animal.id}:`, error);
        // Update in local fallback data and return
        const index = this.fallbackAnimals.findIndex(a => a.id === animal.id);
        if (index !== -1) {
          this.fallbackAnimals[index] = animal;
        }
        return of(animal);
      })
    );
  }
  
  deleteAnimal(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        // Remove from local fallback data
        this.fallbackAnimals = this.fallbackAnimals.filter(animal => animal.id !== id);
      }),
      catchError(error => {
        console.error(`Error deleting animal with id ${id}:`, error);
        // Remove from local fallback data and return success
        this.fallbackAnimals = this.fallbackAnimals.filter(animal => animal.id !== id);
        return of({ success: true });
      })
    );
  }
  
  getNextAnimalId(): Observable<number> {
    return this.getAnimals().pipe(
      map(animals => {
        if (animals.length === 0) {
          return 1;
        }
        const maxId = Math.max(...animals.map(animal => animal.id));
        return maxId + 1;
      }),
      catchError(error => {
        console.error('Error getting next animal ID:', error);
        return of(this.getNextIdForFallback());
      })
    );
  }
  
  searchAnimals(term: string): Observable<Animal[]> {
    if (!term.trim()) {
      return this.getAnimalsByUser();
    }
    
    term = term.toLowerCase();
    return this.getAnimalsByUser().pipe(
      map(animals => animals.filter(animal => 
        animal.nombre.toLowerCase().includes(term) ||
        animal.especie.toLowerCase().includes(term) ||
        animal.sexo.toLowerCase().includes(term) ||
        (animal.enfermedad && animal.enfermedad.toLowerCase().includes(term))
      ))
    );
  }
  
  // Helper methods for fallback functionality
  private getNextIdForFallback(): number {
    if (this.fallbackAnimals.length === 0) {
      return 1;
    }
    return Math.max(...this.fallbackAnimals.map(animal => animal.id)) + 1;
  }
  
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}