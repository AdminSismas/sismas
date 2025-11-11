import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HeaderTasksComponent
} from '@features/tasks/components/header-tasks/header-tasks.component';

describe(HeaderTasksComponent.name, () => {
  let component: HeaderTasksComponent;
  let fixture: ComponentFixture<HeaderTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderTasksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
