import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AccessRecordsComponent
} from '../../../../../../src/app/pages/pages/audit/access-records/access-records.component';

describe(AccessRecordsComponent.name, () => {
  let component: AccessRecordsComponent;
  let fixture: ComponentFixture<AccessRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessRecordsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
