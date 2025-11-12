import { Validators } from "@angular/forms";
import { JSONInput } from '@shared/interfaces/forms';

export const AUTO_APPRAILSAL_INPUTS: JSONInput[] = [
  {
    name: "validity",
    label: "Vigencia",
    placeholder: "Seleccionar vigencia",
    element: "select",
    type: "",
    validators: [Validators.required],
    options: [],
    cssClasses: "w-full"
  },
  {
    name: "toggleValuationType",
    label: "Autoavalúo total",
    placeholder: "",
    element: "toggle",
    type: "",
    validators: [],
    cssClasses: "w-full flex flex-col items-center justify-center"
  },
  {
    name: "selfValuationValueLand",
    label: "Autoavalúo terreno",
    placeholder: "Escribir autoavalúo terreno",
    element: "input",
    type: "text",
    validators: []
  },
  {
    name: "selfValuationValueUnits",
    label: "Autoavalúo construcciones",
    placeholder: "Escribir autoavalúo construcciones",
    element: "input",
    type: "text",
    validators: []
  },
  {
    name: "selfValuationValue",
    label: "Autoavalúo total",
    placeholder: "Escribir autoavalúo total",
    element: "input",
    type: "text",
    validators: [],
    cssClasses: "w-full col-span-2"
  }
];
