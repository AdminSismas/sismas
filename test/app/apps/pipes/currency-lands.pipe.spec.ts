import { CurrencyLandsPipe } from '@shared/pipes/currency-lands.pipe';


describe('CurrencyLandsPipe', () => {
  test('create an instance', () => {
    const pipe = new CurrencyLandsPipe();
    expect(pipe).toBeTruthy();
  });
});
