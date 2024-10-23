import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  CadastralManagementRecordsComponent
} from '../../../../../../src/app/pages/pages/audit/cadastral-management-records/cadastral-management-records.component';

describe(CadastralManagementRecordsComponent.name, () => {
  let component: CadastralManagementRecordsComponent;
  let fixture: ComponentFixture<CadastralManagementRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastralManagementRecordsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastralManagementRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
