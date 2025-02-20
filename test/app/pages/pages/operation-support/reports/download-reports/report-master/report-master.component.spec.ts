import { ComponentFixture, TestBed } from '@angular/core/testing';import { ReportMasterComponent } from 'src/app/pages/pages/operation-support/reports/download-reports/report-master/report-master.component';
1

describe('ReportMasterComponent', () => {
  let component: ReportMasterComponent;
  let fixture: ComponentFixture<ReportMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
