import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

export interface Notification {
  id: number;
  type: string;
  title: string;
  subtitle: string;
  time: string;
  details?: string;
  date?: string;
  hasActions?: boolean;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();
  
  notifications: Notification[] = [
    {
      id: 1,
      type: 'medical',
      title: 'Clery #49',
      subtitle: 'Visita médica programada',
      time: 'Hace una hora',
      hasActions: false
    },
    {
      id: 2,
      type: 'medical',
      title: 'Clery #49',
      subtitle: 'Agrega un detalle de su última visita médica',
      time: 'Hace 6 horas',
      hasActions: true
    },
    {
      id: 3,
      type: 'control',
      title: 'McDelta #145',
      subtitle: 'Control veterinario programado',
      time: 'Hace 8 horas', 
      date: '15 de abril del 2025',
      hasActions: false
    },
    {
      id: 4,
      type: 'vaccine',
      title: 'Vacunación Programada',
      subtitle: 'Recordatorio',
      time: 'Hace un día', 
      details: 'Vacunación del lote #3. Verifica los detalles en tu historial sanitario.',
      date: '25 de abril del 2025',
      hasActions: false
    },
    {
      id: 5,
      type: 'economic',
      title: 'Control Económico',
      subtitle: 'Recordatorio',
      time: 'Hace 2 días', 
      details: 'Fin de mes: ingresa los movimientos económicos para obtener un reporte actualizado de tu rentabilidad.',
      date: '30 de abril del 2025',
      hasActions: false
    },
    {
      id: 6,
      type: 'system',
      title: 'AgroDigital',
      subtitle: 'Se detectó un parto reciente. No olvides registrar el evento para mantener actualizado el historial del animal.',
      time: 'Hace 3 días',
      hasActions: false
    }
  ];

  markAllAsRead(): void {
    console.log('Marked all as read');
  }

  addDetail(notificationId: number): void {
    console.log('Add detail for notification', notificationId);
  }

  dismissNotification(notificationId: number): void {
    console.log('Dismiss notification', notificationId);
  }

  closeNotifications(): void {
    this.close.emit();
  }
}
