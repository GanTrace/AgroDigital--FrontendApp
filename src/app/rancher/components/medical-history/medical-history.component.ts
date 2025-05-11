import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponentComponent } from '../../../public/components/footer-component/footer-component.component';

@Component({
  selector: 'app-medical-history',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponentComponent],
  templateUrl: './medical-history.component.html',
  styleUrls: ['./medical-history.component.css']
})
export class MedicalHistoryComponent {
  selectedAnimal = {
    id: 58,
    nombre: 'CARLY',
    tipo: 'Cabra Lechera',
    fechaNacimiento: '19/04/2022',
    edad: '3 años',
    sexo: 'Hembra',
    problemasSalud: 'No',
    zona: 'B',
    alimentacion: 'Heno y Frutas',
    peso: '40.39 kg',
    crias: '3',
    partos: '1',
    estado: 'Vivo',
    imagen: '/assets/img/cabra.jpg'
  };

  medicalRecords = [
    {
      fecha: '15/04/2025',
      tipoEvento: 'Vacunación',
      descripcion: 'Sin riesgos',
      veterinario: 'Juan De la Rosa',
      observaciones: 'Sin obs.',
      adjuntos: '-'
    },
    {
      fecha: '10/04/2025',
      tipoEvento: 'Revisión',
      descripcion: 'Sin riesgos',
      veterinario: 'Juan De la Rosa',
      observaciones: 'Sin obs.',
      adjuntos: 'Pdf'
    },
    {
      fecha: '5/04/2025',
      tipoEvento: 'Esterilización',
      descripcion: 'Sin riesgos',
      veterinario: 'Juan De la Rosa',
      observaciones: 'Sin obs.',
      adjuntos: '-'
    },
    {
      fecha: '5/03/2025',
      tipoEvento: 'Control médico',
      descripcion: 'Sin riesgos',
      veterinario: 'Esteban Grados',
      observaciones: 'Se receta med...',
      adjuntos: 'Imagen'
    }
  ];
}
