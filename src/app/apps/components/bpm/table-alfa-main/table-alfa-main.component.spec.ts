import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableAlfaMainComponent } from './table-alfa-main.component';

describe('TableAlfaMainComponent', () => {
  let component: TableAlfaMainComponent;
  let fixture: ComponentFixture<TableAlfaMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableAlfaMainComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableAlfaMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
