import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from '../../../public/components/header-component/header-component.component';
import { FooterComponentComponent } from '../../../public/components/footer-component/footer-component.component';
import { PatientService, Patient } from '../../services/patient.service';

@Component({
  selector: 'app-patient-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    HeaderComponent,
    FooterComponentComponent
  ],
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css']
})
export class PatientDetailsComponent implements OnInit {
  patient: Patient | undefined;
  isLoading = true;
  loadError = '';
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService,
    private translate: TranslateService
  ) {}
  
  ngOnInit(): void {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
      this.translate.use(savedLang);
    }
    
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadPatient(+id);
      } else {
        this.router.navigate(['/veterinarian/patients']);
      }
    });
  }
  
  loadPatient(id: number): void {
    this.isLoading = true;
    this.loadError = '';
    
    this.patientService.getPatientById(id).subscribe({
      next: (patient) => {
        this.patient = patient;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading patient:', error);
        this.loadError = 'Error al cargar los datos del paciente. Por favor, inténtelo de nuevo.';
        this.isLoading = false;
      }
    });
  }
  
  goBack(): void {
    this.router.navigate(['/veterinarian/patients']);
  }
  
  editPatient(): void {
    if (this.patient && this.patient.id) {
      this.router.navigate([`/veterinarian/edit-patient/${this.patient.id}`]);
    }
  }
  
  deletePatient(): void {
    if (!this.patient || this.patient.id === undefined) {
      return;
    }
    
    if (confirm('¿Estás seguro de que deseas eliminar este paciente?')) {
      this.patientService.deletePatient(this.patient.id).subscribe({
        next: () => {
          this.router.navigate(['/veterinarian/patients']);
        },
        error: (error) => {
          console.error('Error al eliminar el paciente:', error);
        }
      });
    }
  }
}
