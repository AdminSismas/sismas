import { Validators } from '@angular/forms';

type Element =
  | 'input'
  | 'select'
  | 'toggle'
  | 'date'
  | 'file'
  | 'textarea'
  | 'autocomplete'
  | 'collection'
  | 'checkbox';

export interface JSONInput {
  name: string;
  label: string;
  placeholder: string;
  element: Element;
  type: string;
  validators: Validators[];
  autocompleteOptions?: string[];
  cssClasses?: string;
  options?: { value: string; label: string }[];
}
