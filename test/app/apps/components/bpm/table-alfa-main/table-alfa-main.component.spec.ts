import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableAlfaMainComponent } from 'src/app/apps/components/bpm/table-alfa-main/table-alfa-main.component';


describe(TableAlfaMainComponent.name, () => {
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

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
