import { Component, Inject, signal } from '@angular/core';
import { Group } from '../../interfaces/group.interface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ModalWindowComponent } from '@shared/ui/modal-window/modal-window.component';
@Component({
  selector: 'vex-group-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    ModalWindowComponent
  ],
  templateUrl: './group-dialog.component.html'
})
export class GroupDialogComponent {
  groupForm!: FormGroup;
  group: Group;

  // Signals
  title = signal('');

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<GroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Group
  ) {
    this.group = data
      ? new Group(data)
      : new Group({ groupId: null, name: '', description: '' });
    this.createForm();
    this.title.set(this.group.groupId ? 'Editar grupo' : 'Nuevo grupo');
  }

  private createForm() {
    this.groupForm = this.fb.group({
      name: [this.group.name, [Validators.required]],
      description: [this.group.description, [Validators.required]]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.groupForm.valid) {
      this.dialogRef.close({
        groupId: this.group.groupId,
        ...this.groupForm.value
      });
    }
  }
}
