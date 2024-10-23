import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SequencesComponent
} from '../../../../../../../src/app/pages/pages/configuration/cadastral/sequences/sequences.component';

describe(SequencesComponent.name, () => {
  let component: SequencesComponent;
  let fixture: ComponentFixture<SequencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SequencesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SequencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
