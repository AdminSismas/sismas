import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AlphanumericComponent
} from '../../../../../../../src/app/pages/pages/open-data/downloads/alphanumeric/alphanumeric.component';

describe(AlphanumericComponent.name, () => {
  let component: AlphanumericComponent;
  let fixture: ComponentFixture<AlphanumericComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphanumericComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphanumericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
