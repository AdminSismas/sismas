
import { CurrencyFormatPipe } from '@shared/pipes/currency-format.pipe';


describe('CurrencyFormatPipe', () => {
  test('create an instance', () => {
    const pipe = new CurrencyFormatPipe();
    expect(pipe).toBeTruthy();
  });
});
