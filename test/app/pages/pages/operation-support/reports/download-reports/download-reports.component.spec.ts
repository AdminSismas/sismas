import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DownloadReportsComponent } from 'src/app/pages/pages/operation-support/reports/download-reports/download-reports.component';


describe('DownloadReportsComponent', () => {
  let component: DownloadReportsComponent;
  let fixture: ComponentFixture<DownloadReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
