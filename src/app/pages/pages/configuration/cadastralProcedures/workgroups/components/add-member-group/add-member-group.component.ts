import { Component, inject, OnInit, signal } from '@angular/core';
import { ModalWindowComponent } from 'src/app/apps/components/general-components/modal-window/modal-window.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { User } from 'src/app/apps/interfaces/users/user';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'add-member-group',
  standalone: true,
  imports: [
    ModalWindowComponent,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    AsyncPipe,
    ReactiveFormsModule
  ],
  templateUrl: './add-member-group.component.html'
})
export class AddMemberGroupComponent implements OnInit {
  // Injects
  data = inject<{ users: User[] }>(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<AddMemberGroupComponent>);

  // Signal
  selectedUser = signal<User | null>(null);

  // Properties
  userOptions = this.data.users.map((user) => ({
    label: user.individual.fullName,
    value: user.userId
  }));

  // Observable
  filteredUsers!: Observable<{ label: string; value: number }[]>;

  // Controls
  userInput = new FormControl<string>('');

  ngOnInit(): void {
    this.filteredUsers = this.userInput.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : (value as unknown as { label: string; value: number }).label;
        return name ? this.filterUsers(name) : this.userOptions;
      })
    );
  }

  filterUsers(value: string) {
    const filterValue = value.toLowerCase();

    return this.userOptions.filter((user) => {
      const labelLower = user.label.toLowerCase();

      return labelLower.includes(filterValue);
    });
  }

  displayUser(user: { label: string; value: number }) {
    return user.label;
  }

  addMember() {
    const { value }  = this.userInput;
    this.dialogRef.close({ result: true, userId: value });
  }

  userSelected(event: MatAutocompleteSelectedEvent) {
    const userId = event.option.value.value;

    const user = this.data.users.find((user) => user.userId === userId);

    this.selectedUser.set(user!);
  }
}
