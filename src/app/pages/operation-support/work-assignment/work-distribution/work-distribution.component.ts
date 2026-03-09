import {
  Component,
  signal,
  computed,
  ChangeDetectionStrategy
} from '@angular/core';
import { NgClass } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

export interface WorkDistributionUser {
  id: number;
  name: string;
  avatar: string;
  activeTasks: number;
  percentage: number;
  colorClass: string;
}

@Component({
  selector: 'vex-work-distribution',
  standalone: true,
  imports: [
    NgClass,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './work-distribution.component.html',
  styleUrls: ['./work-distribution.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkDistributionComponent {
  users = signal<WorkDistributionUser[]>([
    {
      id: 1,
      name: 'Wilson Acevedo',
      avatar: 'assets/img/avatars/1.jpg',
      activeTasks: 6,
      percentage: 27.3,
      colorClass: 'bg-teal-600'
    },
    {
      id: 2,
      name: 'Uwaldo Carranza',
      avatar: 'assets/img/avatars/2.jpg',
      activeTasks: 5,
      percentage: 22.7,
      colorClass: 'bg-teal-500'
    },
    {
      id: 3,
      name: 'Patricia Mejía',
      avatar: 'assets/img/avatars/3.jpg',
      activeTasks: 5,
      percentage: 22.7,
      colorClass: 'bg-teal-400'
    },
    {
      id: 4,
      name: 'Andrea Gómez',
      avatar: 'assets/img/avatars/4.jpg',
      activeTasks: 3,
      percentage: 13.6,
      colorClass: 'bg-amber-500'
    },
    {
      id: 5,
      name: 'Carlos Londoño',
      avatar: 'assets/img/avatars/5.jpg',
      activeTasks: 2,
      percentage: 9.1,
      colorClass: 'bg-orange-500'
    },
    {
      id: 6,
      name: 'Mariana Torres',
      avatar: 'assets/img/avatars/6.jpg',
      activeTasks: 1,
      percentage: 4.5,
      colorClass: 'bg-red-500'
    },
    {
      id: 7,
      name: 'Andrés Hurtado',
      avatar: 'assets/img/avatars/7.jpg',
      activeTasks: 1,
      percentage: 4.5,
      colorClass: 'bg-purple-500'
    },
    {
      id: 8,
      name: 'Andrés Hurtado',
      avatar: 'assets/img/avatars/8.jpg',
      activeTasks: 1,
      percentage: 4.5,
      colorClass: 'bg-indigo-500'
    }
  ]);

  maxTasks = computed(() => {
    const currentUsers = this.users();
    return currentUsers.length > 0
      ? Math.max(...currentUsers.map((u) => u.activeTasks))
      : 0;
  });

  selectedView = signal('tabla');
  selectedOrder = signal('mas-tareas');
  selectedRange = signal('rango1');
}
