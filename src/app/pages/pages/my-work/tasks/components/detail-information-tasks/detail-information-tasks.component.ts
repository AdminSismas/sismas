import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
// import { INDIVIDUAL_TYPE_NUMBER, NAME_NO_DISPONIBLE } from '../../../../constants/constant';
// import { InfoOwners } from '../../../../interfaces/information-property/info-owners';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { TaskResponseModel } from 'src/app/apps/interfaces/task-response.model';
import { NAME_NO_DISPONIBLE } from 'src/app/apps/constants/constant';

@Component({
  selector: 'vex-detail-information-property-owner',
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
    MatButtonModule,
    MatDialogClose,
    MatDialogTitle,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    MatDialogContent
  ],
  templateUrl: './detail-information-tasks.component.html'
})
export class DetailInformationTasksComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DetailInformationTasksComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any ,
  ) {
  }

  ngOnInit() {
    // if (this.owner === null || this.owner === undefined) {
    //   this.close();
    // }
    console.log(this.data.value.processName,'datos enviados desde el padre');
  }


  close(): void {
    this.dialogRef.close();
  }

  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;
}
