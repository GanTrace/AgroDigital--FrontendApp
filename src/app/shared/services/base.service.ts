import {environment} from "../../../environments/environment";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {catchError, map, Observable, of, retry, throwError} from "rxjs";
import {inject} from "@angular/core";

export class BaseService<T> {
  protected httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json'}) };

  protected http: HttpClient = inject(HttpClient);

  protected basePath: string = environment.apiUrl;

  protected resourceEndPoint: string = '/resources';

  /**
   * Maneja errores HTTP y devuelve un valor por defecto
   * @param operation Nombre de la operación que falló
   * @param result Valor por defecto a devolver
   */
  protected handleError<R>(operation = 'operation', result?: R) {
    return (error: HttpErrorResponse): Observable<R> => {
      if (error.error instanceof ErrorEvent) {
        console.error(`${operation} failed: ${error.error.message}`);
      } else {
        console.error(`${operation} failed: Backend returned code ${error.status}, body was: ${error.error}`);
      }
      return of(result as R);
    };
  }

  protected resourcePath(): string {
    return `${this.basePath}${this.resourceEndPoint}`;
  }

  /**
   * Crea un nuevo recurso
   * @param item Objeto a crear
   * @returns Observable con el objeto creado
   */
  public create(item: any): Observable<T> {
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id && !item.createdBy) {
      item.createdBy = currentUser.id;
    }
    
    return this.http.post<T>(this.resourcePath(), item, this.httpOptions)
      .pipe(
        catchError(error => {
          console.error('Error creating resource:', error);
          return of(item as T);
        })
      );
  }

  /**
   * Elimina un recurso por su ID
   * @param id ID del recurso a eliminar
   * @returns Observable con la respuesta
   */
  public delete(id: any): Observable<any> {
    return this.http.delete(`${this.resourcePath()}/${id}`, this.httpOptions)
      .pipe(
        catchError(error => {
          console.error(`Error deleting resource with id ${id}:`, error);
          return of({ success: true });
        })
      );
  }

  /**
   * Actualiza un recurso existente
   * @param id ID del recurso a actualizar
   * @param item Objeto con los datos actualizados
   * @returns Observable con el objeto actualizado
   */
  public update(id: any, item: any): Observable<T> {
    return this.http.put<T>(`${this.resourcePath()}/${id}`, item, this.httpOptions)
      .pipe(
        catchError(error => {
          console.error(`Error updating resource with id ${id}:`, error);
          return of(item as T);
        })
      );
  }

  /**
   * Obtiene todos los recursos
   * @returns Observable con array de recursos
   */
  public getAll(): Observable<Array<T>> {
    return this.http.get<Array<T>>(this.resourcePath(), this.httpOptions)
      .pipe(
        catchError(this.handleError<Array<T>>('getAll', []))
      );
  }

  /**
   * Obtiene un recurso por su ID
   * @param id ID del recurso a obtener
   * @returns Observable con el recurso o undefined si no se encuentra
   */
  public getById(id: any): Observable<T | undefined> {
    return this.http.get<T>(`${this.resourcePath()}/${id}`, this.httpOptions)
      .pipe(
        catchError(error => {
          console.error(`Error fetching resource with id ${id}:`, error);
          return of(undefined);
        })
      );
  }

  /**
   * Obtiene recursos filtrados por un campo específico
   * @param field Campo por el que filtrar
   * @param value Valor del campo
   * @returns Observable con array de recursos filtrados
   */
  public getByField(field: string, value: any): Observable<Array<T>> {
    const params = new HttpParams().set(field, value);
    return this.http.get<Array<T>>(this.resourcePath(), { ...this.httpOptions, params })
      .pipe(
        catchError(error => {
          console.error(`Error fetching resources by ${field}=${value}:`, error);
          return of([]);
        })
      );
  }

  /**
   * Obtiene recursos creados por un usuario específico
   * @param userId ID del usuario
   * @returns Observable con array de recursos
   */
  public getByUserId(userId: number): Observable<Array<T>> {
    if (!userId) {
      return of([]);
    }
    return this.getByField('createdBy', userId);
  }

  /**
   * Obtiene recursos creados por el usuario actual
   * @returns Observable con array de recursos
   */
  public getByCurrentUser(): Observable<Array<T>> {
    const currentUser = this.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      return of([]);
    }
    return this.getByUserId(currentUser.id);
  }

  /**
   * Busca recursos que coincidan con un término en cualquiera de los campos especificados
   * @param term Término de búsqueda
   * @returns Observable con array de recursos que coinciden
   */
  public search(term: string): Observable<Array<T>> {
    if (!term.trim()) {
      return this.getAll();
    }
    
    const params = new HttpParams().set('q', term);
    return this.http.get<Array<T>>(this.resourcePath(), { ...this.httpOptions, params })
      .pipe(
        catchError(error => {
          console.error(`Error searching resources with term ${term}:`, error);
          return of([]);
        })
      );
  }

  /**
   * Filtra recursos según criterios específicos
   * @param filters Objeto con los criterios de filtrado
   * @returns Observable con array de recursos filtrados
   */
  public filter(filters: Record<string, any>): Observable<Array<T>> {
    let params = new HttpParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== 'all') {
        params = params.set(key, filters[key]);
      }
    });
    
    return this.http.get<Array<T>>(this.resourcePath(), { ...this.httpOptions, params })
      .pipe(
        catchError(error => {
          console.error('Error filtering resources:', error);
          return of([]);
        })
      );
  }

  /**
   * Realiza una actualización parcial de un recurso
   * @param id ID del recurso a actualizar
   * @param item Objeto con los campos a actualizar
   * @returns Observable con el objeto actualizado
   */
  public patch(id: any, item: Partial<T>): Observable<T> {
    return this.http.patch<T>(`${this.resourcePath()}/${id}`, item, this.httpOptions)
      .pipe(
        catchError(error => {
          console.error(`Error patching resource with id ${id}:`, error);
          return of(item as unknown as T);
        })
      );
  }

  /**
   * Registra un nuevo usuario
   * @param user Datos del usuario a registrar
   * @returns Observable con la respuesta
   */
  public registerUser(user: any): Observable<any> {
    return this.http.post<any>(this.resourcePath(), user, this.httpOptions)
      .pipe(
        catchError(error => {
          console.error('Error registering user:', error);
          return of(user);
        })
      );
  }

  /**
   * Actualiza un usuario
   * @param user Datos del usuario
   * @param id ID del usuario
   * @returns Observable con el usuario actualizado
   */
  public updateUser(user: T, id: number): Observable<T> {
    return this.http.patch<T>(`${this.resourcePath()}/${id}`, user, this.httpOptions)
      .pipe(
        catchError(error => {
          console.error(`Error updating user with id ${id}:`, error);
          return of(user);
        })
      );
  }

  /**
   * Obtiene el usuario actual del servicio de autenticación
   * Este método debe ser sobrescrito en servicios que extienden BaseService
   * y que necesitan acceder al usuario actual
   */
  protected getCurrentUser(): any {
    return null;
  }

  /**
   * Realiza una operación de conteo de recursos
   * @param filters Filtros opcionales para el conteo
   * @returns Observable con el número total
   */
  public count(filters?: Record<string, any>): Observable<number> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== 'all') {
          params = params.set(key, filters[key]);
        }
      });
    }
    
    return this.http.get<number>(`${this.resourcePath()}/count`, { ...this.httpOptions, params })
      .pipe(
        catchError(error => {
          console.error('Error counting resources:', error);
          return of(0);
        })
      );
  }
}