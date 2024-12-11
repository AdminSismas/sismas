import { Component, Inject } from '@angular/core';
import { Group } from '../interfaces/group.interface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'vex-group-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule

    

  ],
  templateUrl: './group-dialog.component.html',
  styleUrl: './group-dialog.component.scss'
})
export class GroupDialogComponent {

  group: Group;

  constructor(
    public dialogRef: MatDialogRef<GroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Group
  ) {
    this.group = data ? new Group(data) : new Group({ groupId: null, name: '', description: '' });
  }

  // Cerrar el modal y pasar el objeto grupo
  onNoClick(): void {
    this.dialogRef.close();
  }

  // Confirmar y pasar el grupo creado o editado
  onSave(): void {
    this.dialogRef.close(this.group);
  }

}
