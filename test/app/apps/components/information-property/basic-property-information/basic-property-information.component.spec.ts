import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BasicPropertyInformationComponent
} from '../../../../../../src/app/apps/components/information-property/basic-property-information/basic-property-information.component';


describe(BasicPropertyInformationComponent.name, () => {
  let component: BasicPropertyInformationComponent;
  let fixture: ComponentFixture<BasicPropertyInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicPropertyInformationComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BasicPropertyInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
