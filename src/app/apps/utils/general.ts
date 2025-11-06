import { booleanAttribute } from '@angular/core';

/**
 * Get random int
 *
 * @param max
 * @returns
 */
export const indexArraylist = (obj:any, value:any) => {
  if (validateVariable(obj) && obj.length > 0) {
    return obj.reduce((acc:any, el:any) => ({
      ...acc,
      [el[value]]: el,
    }), []);
  }
};


export const validateVariable = (obj :string | null | undefined):boolean => {
  return obj !== null && obj !== undefined && obj !== "" || ( typeof obj === 'object');
};

export const validateIsNumber = (val :any):boolean => {
  return val !== null && val !== undefined && val !== "" && typeof val === 'number' && !isNaN(val);
};

export const _filterInformationCode = (code: string, options: any[], keyValue: string, key: string): string | undefined | null => {
  const listOptions: any[] = options
    .filter((option: any): boolean => option[keyValue] === code);
  return listOptions?.length > 0 && listOptions[0][key] ? listOptions[0][key] : null;
};
