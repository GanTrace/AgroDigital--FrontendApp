import { Routes } from '@angular/router';
import { LoginComponent } from './public/pages/login/login.component';
import { RegisterComponent } from './public/pages/register/register.component';
import { PageNotFoundComponent } from './public/pages/page-not-found/page-not-found.component';
import { DashboardComponent } from './rancher/components/dashboard/dashboard.component';
import { EventsComponent } from './rancher/components/events/events.component';
import { MedicalHistoryComponent } from './rancher/components/medical-history/medical-history.component';
import { EconomicControlComponent } from './rancher/components/economic-control/economic-control.component';
import { ReportsComponent } from './rancher/components/reports/reports.component';
import { SettingsComponent } from './public/pages/settings/settings.component';
import { AnimalsComponent } from './rancher/components/animals/animals.component';
import { HeaderComponent } from './public/components/header-component/header-component.component';
import { AddEventComponent } from './rancher/components/add-event/add-event.component';
import { AddExpenseComponent } from './rancher/components/add-expense/add-expense.component';
import { AddIncomeComponent } from './rancher/components/add-income/add-income.component';
import { VetDashboardComponent } from './veterinarian/components/vet-dashboard/vet-dashboard.component';
import { MedicalRecordsComponent } from './veterinarian/components/medical-records/medical-records.component';
import { MedicalAppointmentsComponent } from './veterinarian/components/medical-appointments/medical-appointments.component';
import { PatientsComponent } from './veterinarian/components/patients/patients.component';
import { TreatmentsComponent } from './veterinarian/components/treatments/treatments.component';
import { AddMedicalEventComponent } from './rancher/components/add-medical-event/add-medical-event.component';
import { NewPatientComponent } from './veterinarian/components/new-patient/new-patient.component';
import { PatientDetailsComponent } from './veterinarian/components/patient-details/patient-details.component';
import { NewAppointmentComponent } from './veterinarian/components/new-appointment/new-appointment.component';
import { NewRecordComponent } from './veterinarian/components/new-record/new-record.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path:'page-not-found', component: PageNotFoundComponent },
    { path:'header', component: HeaderComponent },
    // Rancher routes
    { path: 'dashboard', component: DashboardComponent },
    { path: 'animals', component: AnimalsComponent },
    { path: 'events', component: EventsComponent },
    { path: 'medical-history', component: MedicalHistoryComponent }, 
    { path: 'economic-control', component: EconomicControlComponent },
    { path: 'reports', component: ReportsComponent },
    { path: 'settings', component: SettingsComponent },
    { path:'add-event', component: AddEventComponent },
    { path:'add-expense', component: AddExpenseComponent },
    { path:'add-income', component: AddIncomeComponent },
    { path:'add-medical-event', component: AddMedicalEventComponent },
    { path:'add-medical-event/:id', component: AddMedicalEventComponent },
    // Veterinarian routes
    { path: 'veterinarian/dashboard', component: VetDashboardComponent },
    { path: 'veterinarian/medical-records', component: MedicalRecordsComponent },
    { path: 'veterinarian/settings', component: SettingsComponent },
    { path:'veterinarian/medical-appointments', component: MedicalAppointmentsComponent },
    { path:'veterinarian/patients', component: PatientsComponent},
    { path:'veterinarian/treatments', component: TreatmentsComponent},
    { path:'veterinarian/new-patient', component: NewPatientComponent},
    { path:'veterinarian/patient/:id', component: PatientDetailsComponent},
    { path:'veterinarian/new-appointment', component: NewAppointmentComponent},
    { path:'veterinarian/new-record', component: NewRecordComponent},
    { path: '**', redirectTo: 'login' }
  ];

