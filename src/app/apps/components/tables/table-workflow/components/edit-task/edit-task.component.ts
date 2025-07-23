import {
  AfterViewInit,
  Component,
  computed,
  inject,
  signal
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DynamicFormsComponent } from 'src/app/apps/components/forms/dynamic-forms/dynamic-forms.component';
import { ModalWindowComponent } from 'src/app/apps/components/general-components/modal-window/modal-window.component';
import { editTaskInputs } from '../../constants';
import { Preform, Proflow } from 'src/app/apps/interfaces/bpm/workflow.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'edit-task',
  standalone: true,
  imports: [ModalWindowComponent, DynamicFormsComponent],
  templateUrl: './edit-task.component.html'
})
export class EditTaskComponent implements AfterViewInit {
  // Injects
  data = inject<{
    proflow: Proflow & { haveQuestion: boolean };
    preformOptions: Preform[];
  }>(MAT_DIALOG_DATA);

  // Signals
  form = signal<FormGroup>(new FormGroup({}));
  dialogRef = signal<MatDialogRef<unknown> | null>(null);
  title = signal<string>(
    Object.keys(this.data.proflow).length > 1 ? 'Editar tarea' : 'Crear tarea'
  );

  // Computed
  editTaskInputs = computed(() => {
    return editTaskInputs.map((input) => {
      if (input.name === 'preformId') {
        input.options = this.data.preformOptions.map((preform) => ({
          label: preform.name!,
          value: preform.preformId.toString()
        }));
        return input;
      }
      return input;
    });
  });

  ngAfterViewInit(): void {
    this.toggleQuestion();
  }

  toggleQuestion() {
    this.form().controls['haveQuestion'].valueChanges.subscribe((value) => {
      if (value) {
        this.form().controls['question'].enable();
        this.form().controls['questionFlow'].enable();
      } else {
        this.form().controls['question'].disable();
        this.form().controls['questionFlow'].disable();
      }
    });
  }

  onAccept() {
    if (!this.form().valid) {
      Swal.fire({
        text: 'Se deben completar todos los campos requeridos',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        timer: 10000
      });
      return;
    }

    if (!this.dialogRef()) return;

    const dialogRef = this.dialogRef() as MatDialogRef<EditTaskComponent>;

    dialogRef.close({
      response: true,
      data: this.form().value
    });
  }
}
