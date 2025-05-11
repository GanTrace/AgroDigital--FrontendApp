import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-medical-history',
  templateUrl: './medical-history.component.html',
  styleUrls: ['./medical-history.component.css']
})
export class MedicalHistoryComponent {
  animalName: string = 'Carly #58';  
  searchForm: FormGroup;  

  events = [
    {
      fecha: '15/04/2025',
      tipo: 'Vacunación',
      descripcion: 'Sin riesgos',
      veterinario: 'Juan De la Rosa',
      observaciones: 'Sin obs.',
      adjuntos: '-',
      imagen: 'https://via.placeholder.com/150',
    },
    {
      fecha: '10/04/2025',
      tipo: 'Revisión',
      descripcion: 'Sin riesgos',
      veterinario: 'Juan De la Rosa',
      observaciones: 'Sin obs.',
      adjuntos: 'Pdf',
      imagen: 'https://via.placeholder.com/150',
    },
    {
      fecha: '5/04/2025',
      tipo: 'Esterilización',
      descripcion: 'Sin riesgos',
      veterinario: 'Juan De la Rosa',
      observaciones: 'Sin obs.',
      adjuntos: '-',
      imagen: 'https://via.placeholder.com/150',
    },
    {
      fecha: '5/03/2025',
      tipo: 'Control médico',
      descripcion: 'Sin riesgos',
      veterinario: 'Esteban Grados',
      observaciones: 'Se receta medicamento',
      adjuntos: 'Imagen',
      imagen: 'https://via.placeholder.com/150',
    },
  ];

  constructor(private fb: FormBuilder, private router: Router) {
    this.searchForm = this.fb.group({
      searchQuery: ['']
    });
  }

  filterEvents() {
    const query = this.searchForm.value.searchQuery.toLowerCase();
    return this.events.filter(event => event.tipo.toLowerCase().includes(query));
  }

  addVisit() {
    console.log('Añadir visita médica');
  }

  editVisit() {
    console.log('Editar visita médica');
  }

  deleteVisit() {
    console.log('Eliminar visita médica');
  }
}
