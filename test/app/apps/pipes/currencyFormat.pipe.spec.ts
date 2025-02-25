
import { CurrencyFormatPipe } from '../../../../src/app/apps/pipes/currencyFormat.pipe';


describe('CurrencyFormatPipe', () => {
  test('create an instance', () => {
    const pipe = new CurrencyFormatPipe();
    expect(pipe).toBeTruthy();
  });
});
