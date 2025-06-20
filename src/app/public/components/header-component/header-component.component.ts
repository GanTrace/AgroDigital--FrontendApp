import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService, User } from '../../services/auth.service';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { AnimalService } from '../../../rancher/services/animal.service';
import { PatientService } from '../../../veterinarian/services/patient.service';
import { PatientEventService } from '../../../veterinarian/services/patient-event.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header-component',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    LanguageSwitcherComponent,
  ],
  templateUrl: './header-component.component.html',
  styleUrls: ['./header-component.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userName = '';
  userRole = '';
  profileImage = '';
  itemCount = '0';
  showProfileMenu = false;
  user: User | null = null; 
  private patientAddedSubscription: Subscription | null = null;
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService,
    private animalService: AnimalService,
    private patientService: PatientService,
    private patientEventService: PatientEventService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.user = user;
      this.userName = user.name;
      this.userRole = user.role || 'rancher';
      this.profileImage = user.profileImage || 'assets/images/default-avatar.png';
      
      if (this.userRole === 'rancher') {
        this.updateAnimalCount();
      } else if (this.userRole === 'veterinarian') {
        this.updatePatientCount();
        
        this.patientAddedSubscription = this.patientEventService.patientAdded$.subscribe(() => {
          this.updatePatientCount();
        });
      }
    }
  }

  ngOnDestroy(): void {
    if (this.patientAddedSubscription) {
      this.patientAddedSubscription.unsubscribe();
    }
  }

  updateAnimalCount(): void {
    this.animalService.getAnimalsByUser().subscribe(animals => {
      const count = animals.length;
      this.itemCount = `${count} ${count === 1 ? 'animal' : 'animales'}`;
    });
  }

  updatePatientCount(): void {
    this.patientService.getPatientsByUser().subscribe(patients => {
      const count = patients.length;
      this.itemCount = `${count} ${count === 1 ? this.translate.instant('PATIENTS.PATIENT_SINGULAR') : this.translate.instant('PATIENTS.PATIENT_PLURAL')}`;
    });
  }

  
  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
  }

  logout(): void {
    this.authService.logout();
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  getNavLinks(): {path: string, label: string}[] {
    if (this.userRole === 'veterinarian') {
      return [
        { path: '/veterinarian/dashboard', label: 'HEADER.DASHBOARD' },
        { path: '/veterinarian/medical-records', label: 'HEADER.MEDICAL_RECORDS' },
        { path: '/veterinarian/medical-appointments', label: 'HEADER.APPOINTMENTS' },
        { path: '/veterinarian/patients', label: 'HEADER.PATIENTS' },
        { path: '/veterinarian/treatments', label: 'HEADER.TREATMENTS' }
      ];
    } else {
      return [
        { path: '/dashboard', label: 'HEADER.DASHBOARD' },
        { path: '/events', label: 'HEADER.EVENTS' },
        { path: '/medical-history', label: 'HEADER.MEDICAL_HISTORY' },
        { path: '/economic-control', label: 'HEADER.ECONOMIC_CONTROL' },
        { path: '/reports', label: 'HEADER.REPORTS' }
      ];
    }
  }
  
  navigateToDashboard(): void {
    if (this.userRole === 'veterinarian') {
      this.router.navigate(['/veterinarian/dashboard']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  navigateToSettings(): void {
    if (this.userRole === 'veterinarian') {
      this.router.navigate(['/veterinarian/settings']);
    } else {
      this.router.navigate(['/settings']);
    }
    this.showProfileMenu = false;
  }
  
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const userInfo = document.querySelector('.user-info');
    const profileMenu = document.querySelector('.profile-menu');
    
    if (userInfo && profileMenu) {
      if (!userInfo.contains(target) && !profileMenu.contains(target) && this.showProfileMenu) {
        this.showProfileMenu = false;
      }
    }
  }
}