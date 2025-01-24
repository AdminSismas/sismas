import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkHistoricalComponent } from './work-historical.component';

describe('WorkHistoricalComponent', () => {
  let component: WorkHistoricalComponent;
  let fixture: ComponentFixture<WorkHistoricalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkHistoricalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkHistoricalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
