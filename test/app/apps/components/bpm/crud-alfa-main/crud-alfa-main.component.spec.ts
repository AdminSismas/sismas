import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrudAlfaMainComponent } from 'src/app/apps/components/bpm/crud-alfa-main/crud-alfa-main.component';

describe(CrudAlfaMainComponent.name, () => {
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

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
