import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComboboxComponent } from '../../../../../../src/app/apps/components/general-components/combobox/combobox.component';


describe(ComboboxComponent.name, () => {
  let component: ComboboxComponent;
  let fixture: ComponentFixture<ComboboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComboboxComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ComboboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
