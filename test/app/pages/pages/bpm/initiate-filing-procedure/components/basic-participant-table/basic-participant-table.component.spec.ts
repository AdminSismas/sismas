import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BasicParticipantTableComponent
} from '../../../../../../../../src/app/pages/pages/bpm/initiate-filing-procedure/components/basic-participant-table/basic-participant-table.component';

describe('BasicParticipantTableComponent', () => {
  let component: BasicParticipantTableComponent;
  let fixture: ComponentFixture<BasicParticipantTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicParticipantTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicParticipantTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
