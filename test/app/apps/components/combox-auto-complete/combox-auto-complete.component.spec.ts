import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ComboxAutoCompleteComponent
} from '../../../../../src/app/apps/components/combox-auto-complete/combox-auto-complete.component';

describe(ComboxAutoCompleteComponent.name, () => {
  let component: ComboxAutoCompleteComponent;
  let fixture: ComponentFixture<ComboxAutoCompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComboxAutoCompleteComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ComboxAutoCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
