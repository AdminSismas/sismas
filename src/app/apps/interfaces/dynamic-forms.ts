import { Validators } from "@angular/forms";

export interface JSONInput {
  name: string;
  label: string;
  placeholder: string;
  element: 'collection' | 'autocomplete' | 'input';
  type: string;
  validators: Validators[];
  autocompleteOptions?: string[];
}
