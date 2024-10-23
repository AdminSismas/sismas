import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearInformationDataComponent } from './clear-information-data.component';

describe('ClearInformationDataComponent', () => {
  let component: ClearInformationDataComponent;
  let fixture: ComponentFixture<ClearInformationDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClearInformationDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClearInformationDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
