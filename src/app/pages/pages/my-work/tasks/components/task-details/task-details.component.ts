import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { NAME_NO_DISPONIBLE } from '@shared/constants';
import { TablaContent } from '@shared/interfaces';

@Component({
  selector: 'task-details',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './task-details.component.html'
})
export class TaskDetailsComponent {
  /* ----- Properties ----- */
  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;

  /* ----- Inputs ------ */
  executionId = input.required<string>();
  taskDetails = input.required<TablaContent>();
}
