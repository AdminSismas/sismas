export interface BAunitLike {
  content:          Content[] | [];
  pageable:         Pageable;
  totalElements:    number;
  totalPages:       number;
  last:             boolean;
  size:             number;
  number:           number;
  sort:             Sort;
  numberOfElements: number;
  first:            boolean;
  empty:            boolean;
}

export interface Content {
  propertyRegistryOffice:  string;
  propertyRegistryNumber:  string;
  cadastralNumber:         string;
  cadastralArea:           number;
  cadastralRegistryNumber: null;
  domBaunitCondition:      DOMBaunitCondition;
  domBaunitEconoDesti:     DOMBaunitEconoDesti;
  updatedBy:               UpdatedBy;
  updatedAt:               Date;
  baunitIdE:               string;
  cadastralAreaE:          string;
}

export enum DOMBaunitCondition {
  CondominioMatriz = "(Condominio) Matriz",
  CondominioUnidadPredial = "(Condominio) Unidad predial",
}

export enum DOMBaunitEconoDesti {
  Habitacional = "Habitacional",
}

export enum UpdatedBy {
  MigPrediosPlus = "Mig_PrediosPlus",
}

export interface Pageable {
  pageNumber: number;
  pageSize:   number;
  sort:       Sort;
  offset:     number;
  paged:      boolean;
  unpaged:    boolean;
}

export interface Sort {
  empty:    boolean;
  sorted:   boolean;
  unsorted: boolean;
}

