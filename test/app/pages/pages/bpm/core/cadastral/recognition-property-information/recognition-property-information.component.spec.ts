import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  RecognitionPropertyInformation
} from '../../../../../../../../src/app/pages/pages/bpm/core/cadastral/recognition-property-information/recognition-property-information.component';

describe(RecognitionPropertyInformation.name, () => {
  let component: RecognitionPropertyInformation;
  let fixture: ComponentFixture<RecognitionPropertyInformation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecognitionPropertyInformation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecognitionPropertyInformation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
