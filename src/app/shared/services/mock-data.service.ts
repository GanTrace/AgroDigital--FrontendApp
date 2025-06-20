import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from '../../public/services/auth.service';
import { MedicalRecord } from '../../veterinarian/services/medical-record.service';

// Interfaces para otros tipos de datos
export interface Patient {
  id?: number;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  ownerId: number;
  ownerName: string;
  medicalHistory?: string;
  vaccinations?: string[];
  allergies?: string[];
  createdAt?: string;
}

export interface Treatment {
  id?: number;
  name: string;
  description: string;
  duration: string;
  dosage: string;
  frequency: string;
  sideEffects?: string;
  category: string;
}

export interface Appointment {
  id?: number;
  patientId: number;
  patientName: string;
  ownerName: string;
  date: string;
  time: string;
  reason: string;
  status: string;
  veterinarianId?: number;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private users: User[] = [
    {
      id: 1,
      name: 'Dr. María González',
      email: 'maria@veterinaria.com',
      password: '123456',
      role: 'veterinarian',
      profileImage: null
    },
    {
      id: 2,
      name: 'Juan Pérez',
      email: 'juan@rancho.com',
      password: '123456',
      role: 'rancher',
      profileImage: null
    },
    {
      id: 3,
      name: 'Ana López',
      email: 'ana@granja.com',
      password: '123456',
      role: 'rancher',
      profileImage: null
    }
  ];

  private patients: Patient[] = [
    {
      id: 1,
      name: 'Bella',
      species: 'Bovino',
      breed: 'Holstein',
      age: 3,
      weight: 450,
      ownerId: 2,
      ownerName: 'Juan Pérez',
      medicalHistory: 'Sin antecedentes relevantes',
      vaccinations: ['Fiebre Aftosa', 'Brucelosis'],
      allergies: [],
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'Max',
      species: 'Porcino',
      breed: 'Yorkshire',
      age: 2,
      weight: 180,
      ownerId: 3,
      ownerName: 'Ana López',
      medicalHistory: 'Tratamiento preventivo contra parásitos',
      vaccinations: ['Peste Porcina', 'Circovirus'],
      allergies: ['Penicilina'],
      createdAt: '2024-02-10'
    }
  ];

  private treatments: Treatment[] = [
    {
      id: 1,
      name: 'Antibiótico Amoxicilina',
      description: 'Tratamiento antibiótico de amplio espectro',
      duration: '7 días',
      dosage: '500mg',
      frequency: 'Cada 12 horas',
      sideEffects: 'Posibles trastornos gastrointestinales',
      category: 'Antibióticos'
    },
    {
      id: 2,
      name: 'Vacuna Fiebre Aftosa',
      description: 'Vacuna preventiva contra fiebre aftosa',
      duration: '1 aplicación',
      dosage: '2ml',
      frequency: 'Anual',
      sideEffects: 'Inflamación leve en el sitio de aplicación',
      category: 'Vacunas'
    }
  ];

  private medicalRecords: MedicalRecord[] = [
    {
      id: 1,
      patientId: 1,
      patientName: 'Bella',
      ownerName: 'Juan Pérez',
      date: '2024-03-15',
      recordType: 'Consulta General',
      diagnosis: 'Revisión rutinaria - Animal en buen estado',
      treatment: 'Vitaminas y minerales',
      notes: 'Animal presenta buen estado general, peso adecuado',
      followUp: 'Próxima revisión en 6 meses',
      attachments: [],
      createdBy: 1,
      createdAt: '2024-03-15T10:30:00Z'
    },
    {
      id: 2,
      patientId: 2,
      patientName: 'Max',
      ownerName: 'Ana López',
      date: '2024-03-20',
      recordType: 'Tratamiento',
      diagnosis: 'Infección respiratoria leve',
      treatment: 'Antibiótico Amoxicilina 500mg cada 12h por 7 días',
      notes: 'Paciente presenta síntomas leves de infección respiratoria',
      followUp: 'Control en 1 semana',
      attachments: [],
      createdBy: 1,
      createdAt: '2024-03-20T14:15:00Z'
    }
  ];

  private appointments: Appointment[] = [
    {
      id: 1,
      patientId: 1,
      patientName: 'Bella',
      ownerName: 'Juan Pérez',
      date: '2024-04-15',
      time: '10:00',
      reason: 'Revisión rutinaria',
      status: 'Programada',
      veterinarianId: 1,
      notes: 'Chequeo general y vacunación'
    },
    {
      id: 2,
      patientId: 2,
      patientName: 'Max',
      ownerName: 'Ana López',
      date: '2024-04-18',
      time: '14:30',
      reason: 'Control post-tratamiento',
      status: 'Programada',
      veterinarianId: 1,
      notes: 'Verificar evolución de infección respiratoria'
    }
  ];

  private nextId = {
    users: 4,
    patients: 3,
    treatments: 3,
    medicalRecords: 3,
    appointments: 3
  };

  // Métodos para usuarios
  getUsers(): Observable<User[]> {
    return of([...this.users]).pipe(delay(300));
  }

  getUsersByRole(role: string): Observable<User[]> {
    const filteredUsers = this.users.filter(user => user.role === role);
    return of([...filteredUsers]).pipe(delay(300));
  }

  getUserById(id: number): Observable<User> {
    const user = this.users.find(u => u.id === id);
    if (user) {
      return of({...user}).pipe(delay(300));
    }
    return throwError(() => new Error('Usuario no encontrado'));
  }

  getUserByCredentials(email: string, password: string): Observable<User[]> {
    const user = this.users.filter(u => u.email === email && u.password === password);
    return of([...user]).pipe(delay(300));
  }

  addUser(user: User): Observable<User> {
    const newUser = { ...user, id: this.nextId.users++ };
    this.users.push(newUser);
    return of({...newUser}).pipe(delay(300));
  }

  updateUser(user: User): Observable<User> {
    const index = this.users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      this.users[index] = { ...user };
      return of({...this.users[index]}).pipe(delay(300));
    }
    return throwError(() => new Error('Usuario no encontrado'));
  }

  // Métodos para pacientes
  getPatients(): Observable<Patient[]> {
    return of([...this.patients]).pipe(delay(300));
  }

  getPatientById(id: number): Observable<Patient> {
    const patient = this.patients.find(p => p.id === id);
    if (patient) {
      return of({...patient}).pipe(delay(300));
    }
    return throwError(() => new Error('Paciente no encontrado'));
  }

  addPatient(patient: Patient): Observable<Patient> {
    const newPatient = { ...patient, id: this.nextId.patients++ };
    this.patients.push(newPatient);
    return of({...newPatient}).pipe(delay(300));
  }

  updatePatient(patient: Patient): Observable<Patient> {
    const index = this.patients.findIndex(p => p.id === patient.id);
    if (index !== -1) {
      this.patients[index] = { ...patient };
      return of({...this.patients[index]}).pipe(delay(300));
    }
    return throwError(() => new Error('Paciente no encontrado'));
  }

  deletePatient(id: number): Observable<any> {
    const index = this.patients.findIndex(p => p.id === id);
    if (index !== -1) {
      this.patients.splice(index, 1);
      return of(null).pipe(delay(300));
    }
    return throwError(() => new Error('Paciente no encontrado'));
  }

  // Métodos para tratamientos
  getTreatments(): Observable<Treatment[]> {
    return of([...this.treatments]).pipe(delay(300));
  }

  getTreatmentById(id: number): Observable<Treatment> {
    const treatment = this.treatments.find(t => t.id === id);
    if (treatment) {
      return of({...treatment}).pipe(delay(300));
    }
    return throwError(() => new Error('Tratamiento no encontrado'));
  }

  addTreatment(treatment: Treatment): Observable<Treatment> {
    const newTreatment = { ...treatment, id: this.nextId.treatments++ };
    this.treatments.push(newTreatment);
    return of({...newTreatment}).pipe(delay(300));
  }

  updateTreatment(treatment: Treatment): Observable<Treatment> {
    const index = this.treatments.findIndex(t => t.id === treatment.id);
    if (index !== -1) {
      this.treatments[index] = { ...treatment };
      return of({...this.treatments[index]}).pipe(delay(300));
    }
    return throwError(() => new Error('Tratamiento no encontrado'));
  }

  deleteTreatment(id: number): Observable<any> {
    const index = this.treatments.findIndex(t => t.id === id);
    if (index !== -1) {
      this.treatments.splice(index, 1);
      return of(null).pipe(delay(300));
    }
    return throwError(() => new Error('Tratamiento no encontrado'));
  }

  // Métodos para registros médicos
  getMedicalRecords(): Observable<MedicalRecord[]> {
    return of([...this.medicalRecords]).pipe(delay(300));
  }

  getMedicalRecordsByUser(userId: number): Observable<MedicalRecord[]> {
    const filteredRecords = this.medicalRecords.filter(record => record.createdBy === userId);
    return of([...filteredRecords]).pipe(delay(300));
  }

  getMedicalRecordById(id: number): Observable<MedicalRecord> {
    const record = this.medicalRecords.find(r => r.id === id);
    if (record) {
      return of({...record}).pipe(delay(300));
    }
    return throwError(() => new Error('Registro médico no encontrado'));
  }

  addMedicalRecord(record: MedicalRecord): Observable<MedicalRecord> {
    const newRecord = { 
      ...record, 
      id: this.nextId.medicalRecords++,
      createdAt: new Date().toISOString()
    };
    this.medicalRecords.push(newRecord);
    return of({...newRecord}).pipe(delay(300));
  }

  updateMedicalRecord(record: MedicalRecord): Observable<MedicalRecord> {
    const index = this.medicalRecords.findIndex(r => r.id === record.id);
    if (index !== -1) {
      this.medicalRecords[index] = { ...record };
      return of({...this.medicalRecords[index]}).pipe(delay(300));
    }
    return throwError(() => new Error('Registro médico no encontrado'));
  }

  deleteMedicalRecord(id: number): Observable<any> {
    const index = this.medicalRecords.findIndex(r => r.id === id);
    if (index !== -1) {
      this.medicalRecords.splice(index, 1);
      return of(null).pipe(delay(300));
    }
    return throwError(() => new Error('Registro médico no encontrado'));
  }

  // Métodos para citas
  getAppointments(): Observable<Appointment[]> {
    return of([...this.appointments]).pipe(delay(300));
  }

  getAppointmentById(id: number): Observable<Appointment> {
    const appointment = this.appointments.find(a => a.id === id);
    if (appointment) {
      return of({...appointment}).pipe(delay(300));
    }
    return throwError(() => new Error('Cita no encontrada'));
  }

  addAppointment(appointment: Appointment): Observable<Appointment> {
    const newAppointment = { ...appointment, id: this.nextId.appointments++ };
    this.appointments.push(newAppointment);
    return of({...newAppointment}).pipe(delay(300));
  }

  updateAppointment(appointment: Appointment): Observable<Appointment> {
    const index = this.appointments.findIndex(a => a.id === appointment.id);
    if (index !== -1) {
      this.appointments[index] = { ...appointment };
      return of({...this.appointments[index]}).pipe(delay(300));
    }
    return throwError(() => new Error('Cita no encontrada'));
  }

  deleteAppointment(id: number): Observable<any> {
    const index = this.appointments.findIndex(a => a.id === id);
    if (index !== -1) {
      this.appointments.splice(index, 1);
      return of(null).pipe(delay(300));
    }
    return throwError(() => new Error('Cita no encontrada'));
  }
}