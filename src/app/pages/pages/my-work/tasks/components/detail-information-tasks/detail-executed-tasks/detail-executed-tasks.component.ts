import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TaskRetailExecuteResponseModel } from '../../../../../../../apps/interfaces/bpm/task-retail-execute-response.model';

import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { NAME_NO_DISPONIBLE } from '../../../../../../../apps/constants/general/constants';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'vex-detail-executed-tasks',
  standalone: true,
  animations: [
  fadeInRight400ms,
      stagger80ms,
      scaleIn400ms,
      stagger40ms,
      fadeInUp400ms,
      scaleFadeIn400ms,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogTitle,
    MatDividerModule ,
    MatDialogClose,
    MatMenuModule,


  ],
  templateUrl: './detail-executed-tasks.component.html',
  styleUrl: './detail-executed-tasks.component.scss'
})
export class DetailExecutedTasksComponent implements OnInit {

   constructor(
      @Inject(MAT_DIALOG_DATA) public data: TaskRetailExecuteResponseModel | undefined,
      private dialogRef: MatDialogRef<DetailExecutedTasksComponent>,
    ) {
    }


    ngOnInit() {
console.log('data desde el modal detalles ', this.data);
      if (this.data === null || this.data === undefined) {
        this.close();
        return;
      }
      if (this.data?.taskId === null || this.data?.taskId === undefined) {
        this.close();
        return;
      }
    }

    close(): void {
      this.dialogRef.close();
    }

    getAbsoluteValue(value: number): number {
      return Math.abs(value);
    }

     protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;
}
