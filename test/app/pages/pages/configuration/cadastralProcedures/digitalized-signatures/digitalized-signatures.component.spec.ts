import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  DigitalizedSignaturesComponent
} from '../../../../../../../src/app/pages/pages/configuration/cadastralProcedures/digitalized-signatures/digitalized-signatures.component';

describe(DigitalizedSignaturesComponent.name, () => {
  let component: DigitalizedSignaturesComponent;
  let fixture: ComponentFixture<DigitalizedSignaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DigitalizedSignaturesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DigitalizedSignaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
