import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Patient } from './patient.service';

@Injectable({
  providedIn: 'root'
})
export class PatientEventService {
  private patientAddedSource = new Subject<Patient>();
  
  patientAdded$ = this.patientAddedSource.asObservable();
  
  notifyPatientAdded(patient: Patient): void {
    this.patientAddedSource.next(patient);
  }
}