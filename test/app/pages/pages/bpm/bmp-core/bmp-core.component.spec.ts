import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BmpCoreComponent } from '../../../../../../src/app/pages/pages/bpm/bmp-core/bmp-core.component';

describe(BmpCoreComponent.name, () => {
  let component: BmpCoreComponent;
  let fixture: ComponentFixture<BmpCoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BmpCoreComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BmpCoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
