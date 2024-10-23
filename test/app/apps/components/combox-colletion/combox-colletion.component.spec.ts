import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ComboxColletionComponent
} from '../../../../../src/app/apps/components/combox-colletion/combox-colletion.component';

describe(ComboxColletionComponent.name, () => {
  let component: ComboxColletionComponent;
  let fixture: ComponentFixture<ComboxColletionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComboxColletionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComboxColletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
