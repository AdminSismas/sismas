import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IcaPhotosComponent } from './ica-photos.component';

describe('IcaPhotosComponent', () => {
  let component: IcaPhotosComponent;
  let fixture: ComponentFixture<IcaPhotosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IcaPhotosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IcaPhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
