import { booleanAttribute } from '@angular/core';

/**
 * Get random int
 *
 * @param max
 * @returns
 */
export const getRandomInt = (max: number): number => {
  return Math.floor(Math.random() * max);
}

export const  indexArraylist = (obj:any, value:any) => {
  if (validarVariable(obj) && obj.length > 0) {
    return obj.reduce((acc:any, el:any) => ({
      ...acc,
      [el[value]]: el,
    }), []);
  }
}

export const validarVariable = (obj :string):boolean => {
  return obj !== null && obj !== undefined && obj !== "" || ( typeof obj === 'object');
}
