import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  OutputFormatsComponent
} from '../../../../../../../src/app/pages/pages/configuration/cadastralProcedures/output-formats/output-formats.component';

describe(OutputFormatsComponent.name, () => {
  let component: OutputFormatsComponent;
  let fixture: ComponentFixture<OutputFormatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutputFormatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutputFormatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
