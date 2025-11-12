import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  WorkgroupsComponent
} from '@pages/configuration/cadastral-procedures/workgroups/workgroups.component';

describe(WorkgroupsComponent.name, () => {
  let component: WorkgroupsComponent;
  let fixture: ComponentFixture<WorkgroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkgroupsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkgroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
