import { Injector, Type } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultExport } from '@angular/router';

export type ComponentTemplate = {
  nameComponent: string,
  component: Type<any>,
  loadComponent?: () => Type<unknown> | Observable<Type<unknown> | DefaultExport<Type<unknown>>> | Promise<Type<unknown> | DefaultExport<Type<unknown>>>,
  inputs?:Record<string, unknown>,
  componentData?: Injector;
};

export interface BasicComponentTemplate {
  name: string;
  pathForm: string;
  serviceValidation: string;
}

