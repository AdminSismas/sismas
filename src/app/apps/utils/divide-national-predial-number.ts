import { NationalPredialNumber } from '../interfaces/national-predial-number';

export function divideNpn(npnStr: string| null | undefined):NationalPredialNumber {
  if(npnStr === null || npnStr === undefined || npnStr.length <= 0){
    return new NationalPredialNumber();
  }
  return new NationalPredialNumber(
    npnStr.substring(0, 2),
    npnStr.substring(2, 5),
    npnStr.substring(5, 7),
    npnStr.substring(7, 9),
    npnStr.substring(9, 11),
    npnStr.substring(11, 13),
    npnStr.substring(13, 17),
    npnStr.substring(17, 21),
    npnStr.substring(21, 22),
    npnStr.substring(22, 24),
    npnStr.substring(24, 26),
    npnStr.substring(26)
  );
}
