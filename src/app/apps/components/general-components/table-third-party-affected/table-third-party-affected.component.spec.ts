import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableThirdPartyAffectedComponent } from './table-third-party-affected.component';

describe('TableThirdPartyAffectedComponent', () => {
  let component: TableThirdPartyAffectedComponent;
  let fixture: ComponentFixture<TableThirdPartyAffectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableThirdPartyAffectedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableThirdPartyAffectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
