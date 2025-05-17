import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

export interface Notification {
  id: number;
  type: string;
  title: string;
  subtitle: string;
  time?: string;
  date?: string;
  details?: string;
  hasActions: boolean;
  read: boolean;
  imageUrl?: string;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  @Input() isVisible: boolean = true;
  @Output() close = new EventEmitter<void>();
  
  notifications: Notification[] = [
    {
      id: 1,
      type: 'medical',
      title: 'Clery #49',
      subtitle: 'Visita médica programada',
      time: 'Hace una hora',
      read: false,
      hasActions: false,
      imageUrl: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: 2,
      type: 'medical',
      title: 'Clery #49',
      subtitle: 'Agrega un detalle de su última visita médica',
      time: 'Hace 6 horas',
      hasActions: true,
      read: false,
      imageUrl: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: 3,
      type: 'veterinary',
      title: 'McDelta #145',
      subtitle: 'Control veterinario programado',
      time: 'Hace 8 horas',
      read: false,
      hasActions: false,
      imageUrl: 'https://images.unsplash.com/photo-1584704135557-d8bf7ca50eae?q=80&w=1000&auto=format&fit=crop'
    },
    {
      id: 4,
      type: 'vaccine',
      title: 'Vacunación Programada',
      subtitle: 'Recordatorio',
      date: 'Hace un día',
      details: 'Vacunación del lote #3. Verifica los detalles en tu historial sanitario.',
      read: false,
      hasActions: false,
      imageUrl: 'https://images.unsplash.com/photo-1584704135557-d8bf7ca50eae?q=80&w=1000&auto=format&fit=crop'
    }
  ];

  defaultImages: {[key: string]: string} = {
    'medical': 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=1000&auto=format&fit=crop',
    'veterinary': 'https://images.unsplash.com/photo-1584704135557-d8bf7ca50eae?q=80&w=1000&auto=format&fit=crop',
    'vaccine': 'https://images.unsplash.com/photo-1612277394714-5c4110e63e2b?q=80&w=1000&auto=format&fit=crop',
    'event': 'https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=1000&auto=format&fit=crop',
    'default': 'https://images.unsplash.com/photo-1533167649158-6d508895b680?q=80&w=1000&auto=format&fit=crop'
  };

  get unreadCount(): number {
    return this.notifications.filter(notification => !notification.read).length;
  }

  constructor() { }

  ngOnInit(): void {
    this.notifications.forEach(notification => {
      if (!notification.imageUrl) {
        notification.imageUrl = this.getImageForType(notification.type);
      }
    });
  }

  getImageForType(type: string): string {
    return this.defaultImages[type] || this.defaultImages['default'];
  }

  closeNotifications(): void {
    this.close.emit();
  }

  markAllAsRead(): void {
    this.notifications.forEach(notification => {
      notification.read = true;
    });

  }

  addDetail(id: number): void {
    console.log(`Agregar detalle a la notificación ${id}`);
    
    this.dismissNotification(id);
  }

  dismissNotification(id: number): void {
    this.notifications = this.notifications.filter(notification => notification.id !== id);
  }
}
