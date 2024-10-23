import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingAppComponent } from '../../../../../src/app/apps/components/loading-app/loading-app.component';

describe(LoadingAppComponent.name, () => {
  let component: LoadingAppComponent;
  let fixture: ComponentFixture<LoadingAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingAppComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
