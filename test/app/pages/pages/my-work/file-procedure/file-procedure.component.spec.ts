import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FileProcedureComponent
} from '@pages/my-work/file-procedure/file-procedure.component';

describe(FileProcedureComponent.name, () => {
  let component: FileProcedureComponent;
  let fixture: ComponentFixture<FileProcedureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileProcedureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileProcedureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
