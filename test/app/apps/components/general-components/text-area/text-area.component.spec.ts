import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextAreaComponent } from 'src/app/apps/components/general-components/text-area/text-area.component';


describe(TextAreaComponent.name, () => {
  let component: TextAreaComponent;
  let fixture: ComponentFixture<TextAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextAreaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
