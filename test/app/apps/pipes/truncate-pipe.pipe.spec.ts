import { TruncatePipe } from '@shared/pipes/truncate-pipe.pipe';


describe('TruncatePipe', () => {

  test('create an instance', () => {
    const pipe = new TruncatePipe();
    expect(pipe).toBeTruthy();
  });
});
