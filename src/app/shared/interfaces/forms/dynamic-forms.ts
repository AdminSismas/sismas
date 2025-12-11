import { Validators } from '@angular/forms';
import { Element } from '@shared/interfaces';

export interface JSONInput {
  name: string;
  label: string;
  placeholder: string;
  element: Element;
  type: string;
  validators: Validators[];
  autocompleteOptions?: string[];
  cssClasses?: string;
  verticalComponent?: boolean | null;
  noVisibleComponent?: boolean | null;
  options?: { value: string | boolean | number; label: string }[];
  multiple?: boolean;
  valueCode?: boolean;
}
