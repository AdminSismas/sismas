import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ProcessCardComponent
} from '@features/bpm-workflows/components/initite-filing-procedure/process-card/process-card.component';

describe('ProcessCardComponent', () => {
  let component: ProcessCardComponent;
  let fixture: ComponentFixture<ProcessCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
