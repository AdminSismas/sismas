import { Validators } from "@angular/forms";
import { JSONInput } from '@shared/interfaces';

export const inputsAddPhotos: JSONInput[] = [
  {
    name: "file",
    label: "Foto",
    placeholder: "Agregar foto",
    element: "file",
    type: "image/jpeg, image/png, image/jpg",
    validators: [Validators.required],
    multiple: false,
  }
];
