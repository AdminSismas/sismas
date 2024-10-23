import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  DomainLADMCOLComponent
} from '../../../../../../../src/app/pages/pages/configuration/cadastral/domain-ladm-col/domain-ladm-col.component';


describe(DomainLADMCOLComponent.name, () => {
  let component: DomainLADMCOLComponent;
  let fixture: ComponentFixture<DomainLADMCOLComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DomainLADMCOLComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DomainLADMCOLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
