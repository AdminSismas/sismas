import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeopleComponent } from '../../../../../../src/app/pages/pages/operation-support/people/people.component';

describe(PeopleComponent.name, () => {
  let component: PeopleComponent;
  let fixture: ComponentFixture<PeopleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeopleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
