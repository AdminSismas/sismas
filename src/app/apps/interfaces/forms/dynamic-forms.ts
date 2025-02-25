import { Validators } from "@angular/forms";

export interface JSONInput {
  name: string;
  label: string;
  placeholder: string;
  element: 'collection' | 'autocomplete' | 'input' | 'file' | 'select' | 'date' | 'toggle' | 'checkbox';
  type: string;
  validators: Validators[];
  autocompleteOptions?: string[];
  cssClasses?: string;
  options?: { value: string, label: string }[];
}
