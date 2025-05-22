import { Validators } from '@angular/forms';
import { Element } from '../general/content-info';

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
  options?: { value: string; label: string }[];
  multiple?: boolean;
}
