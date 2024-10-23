import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  PrioritizeWorkComponent
} from '../../../../../../../src/app/pages/pages/operation-support/procedures/prioritize-work/prioritize-work.component';

describe(PrioritizeWorkComponent.name, () => {
  let component: PrioritizeWorkComponent;
  let fixture: ComponentFixture<PrioritizeWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrioritizeWorkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrioritizeWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
