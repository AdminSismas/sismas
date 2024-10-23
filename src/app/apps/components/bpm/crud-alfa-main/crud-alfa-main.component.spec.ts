import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudAlfaMainComponent } from './crud-alfa-main.component';

describe('CrudAlfaMainComponent', () => {
  let component: CrudAlfaMainComponent;
  let fixture: ComponentFixture<CrudAlfaMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudAlfaMainComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrudAlfaMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
